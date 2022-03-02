import * as React from 'react';
import {
    Button,
    FileUpload,
    Form,
    FormGroup,
    Tooltip,
} from '@patternfly/react-core';
import {Modal} from './Modal';
import {Msg} from './Msg';
import {KeycloakContext} from '../keycloak-service/KeycloakContext';
import {KeycloakService} from '../keycloak-service/keycloak.service';
import Cropper from "cropperjs";

interface UploadAvatarModelProps {
    type: string;
    buttonTitle?: string;
    buttonId?: string;
    oldAvatar?: string;

    render?(toggle: () => void): React.ReactNode;

    onChange?: (newAvatar: string | undefined) => void;
    onClose?: () => void;
    isDisabled?: boolean;
    isSmall?: boolean;
    isLarge?: boolean;
}

interface UploadAvatarModelState {
    isModalOpen: boolean;

    avatarUrl?: string;

    selectedFile?: File;
    selectedFileName: string;
    selectedFileUrl?: string;

    saveBtnLabel: string;
    saveBtnEnabled: boolean;

    errors: {
        file: string;
    };
}

/**
 * show a modal to change user avatar
 *
 * @author Hyperzlib hyperzlib@outlook.com
 */
export class UploadAvatarModal extends React.Component<UploadAvatarModelProps, UploadAvatarModelState> {
    private keycloak?: KeycloakService;
    private cropper?: Cropper;

    protected static defaultProps = {
        buttonVariant: 'primary',
        modalContinueButtonLabel: 'continue',
        modalCancelButtonLabel: 'doCancel',
        isDisabled: false,
        isSmall: true
    };

    public constructor(props: UploadAvatarModelProps) {
        super(props);

        this.state = {
            isModalOpen: false,

            selectedFile: undefined,
            selectedFileName: "",

            saveBtnLabel: Msg.localize("doSave"),
            saveBtnEnabled: true,
            errors: {
                file: ""
            }
        };
    }

    public componentDidMount() {

    }

    public componentDidUpdate(prevProps: UploadAvatarModelProps, prevStates: UploadAvatarModelState) {
        if (this.state.selectedFileUrl && prevStates.selectedFileUrl != this.state.selectedFileUrl) {
            this.initCropper();
        }
    }

    private initKeycloakService = (keycloak: KeycloakService | undefined) => {
        if (typeof this.keycloak === 'undefined') {
            this.keycloak = keycloak;
            this.setState({
                avatarUrl: keycloak?.authServerUrl() + 'realms/' + keycloak?.realm() + '/avatar?_=' + (new Date().getTime().toString())
            });
        }
    };

    private initCropper = () => {
        if (this.cropper) {
            this.destoryCropper();
        }

        let container = document.querySelector('.uploadAvatarModal .cropper-container img');
        if (container) {
            this.cropper = new Cropper((container as HTMLImageElement), {
                viewMode: 1,
                aspectRatio: 1,
                scalable: false,
                rotatable: false
            });
        }
    };

    private destoryCropper = () => {
        if (this.cropper) {
            this.cropper.destroy();
        }
    };

    private validateAvatar = () => {
        if (!this.state.selectedFile) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    file: Msg.localize("uploadAvatarFileNotSelected")
                }
            });
            return false;
        }
        return true;
    };

    private handleFileChange = (value: File, filename: string) => {
        if (this.state.selectedFileUrl) {
            URL.revokeObjectURL(this.state.selectedFileUrl);
        }

        let selectedFileUrl;
        if (value) {
            selectedFileUrl = URL.createObjectURL(value);
        } else {
            selectedFileUrl = undefined;
            this.destoryCropper();
        }

        this.setState({
            selectedFileUrl,
            selectedFile: value,
            selectedFileName: filename,
            errors: {
                ...this.state.errors,
                file: "",
            }
        });
    };

    private handleModalToggle = (isOpen = !this.state.isModalOpen) => {
        this.setState({
            isModalOpen: isOpen
        });
        if (!this.state.isModalOpen && this.props.onClose) this.props.onClose();
    };

    private handleSaveAvatar = () => {
        if (!this.validateAvatar()) return false;

        let formData = new FormData();

        let cropData = this.cropper?.getData(true);
        if (!cropData || !this.state.selectedFile) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    file: Msg.localize("uploadAvatarFileNotSelected")
                }
            });
            return false;
        }

        formData.append("crop", `${cropData.x},${cropData.y},${cropData.width}`);
        formData.append("image", this.state.selectedFile);

        this.setState({
            saveBtnEnabled: false,
            saveBtnLabel: Msg.localize("uploadingAvatar")
        });
        fetch(this.keycloak?.authServerUrl() + 'realms/' + this.keycloak?.realm() + '/avatar', {
            method: 'POST',
            body: formData,
            credentials: "include"
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Http request error");
            }
        }).then((data) => {
            if (data.status === 1) {
                if (this.props.onChange) {
                    this.props.onChange(data.avatar);
                }
                this.setState({
                    avatarUrl: data.avatar + "?_=" + (new Date().getTime().toString()),
                });
                this.handleModalToggle(false);
            } else {
                if (data.errormsg) {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            file: Msg.localize("uploadAvatarError") + ": " + Msg.localize(data.errormsg)
                        }
                    });
                } else if (data.error) {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            file: Msg.localize("uploadAvatarError") + ": " + data.error
                        }
                    });
                } else {
                    this.setState({
                        errors: {
                            ...this.state.errors,
                            file: Msg.localize("uploadAvatarErrorRequest")
                        }
                    });
                }
            }

            this.setState({
                saveBtnEnabled: true,
                saveBtnLabel: Msg.localize("doSave")
            });
        }).catch((err) => {
            console.error("Cannot save avatar", err);
            this.setState({
                saveBtnEnabled: true,
                saveBtnLabel: Msg.localize("doSave"),
                errors: {
                    ...this.state.errors,
                    file: Msg.localize("uploadAvatarErrorRequest") + ": " + err.message,
                }
            });
        })
    };

    public render(): React.ReactNode {
        const {isModalOpen} = this.state;

        return (
            <React.Fragment>
                <KeycloakContext.Consumer>
                    {
                        keycloak => {
                            this.initKeycloakService(keycloak);
                            return (
                                <Tooltip content={this.props.buttonTitle}>
                                    <Button
                                        id={this.props.buttonId}
                                        variant="link"
                                        onClick={() => this.handleModalToggle(true)}
                                        isDisabled={this.props.isDisabled}
                                    >
                                        <img
                                            className="pf-c-avatar"
                                            src={this.state.avatarUrl}
                                            alt={Msg.localize('avatar')}
                                        />
                                    </Button>
                                </Tooltip>
                            )
                        }
                    }
                </KeycloakContext.Consumer>
                {this.props.render && this.props.render(() => this.handleModalToggle(true))}
                <Modal
                    className={"uploadAvatarModal"}
                    title={Msg.localize('uploadAvatar')}
                    isModalOpen={isModalOpen}
                    disabled={this.props.isDisabled}
                    isSmall={this.props.isSmall}
                    isLarge={this.props.isLarge}
                    onClose={() => this.handleModalToggle(false)}
                    actions={[
                        <Button id='modal-confirm' key="confirm" variant="primary" onClick={this.handleSaveAvatar}>
                            {this.state.saveBtnLabel}
                        </Button>
                    ]}
                >
                    <Form isHorizontal>
                        <FormGroup
                            fieldId="avatar-file"
                            className="fileSelectFormGroup"
                            helperTextInvalid={this.state.errors.file}
                            isValid={this.state.errors.file === ''}
                        >
                            <FileUpload
                                id="avatar-file"
                                value={this.state.selectedFile}
                                filename={this.state.selectedFileName}
                                filenamePlaceholder={Msg.localize('uploadAvatarPlaceholder')}
                                onChange={this.handleFileChange}
                                hideDefaultPreview
                                browseButtonText={Msg.localize('uploadAvatarChooseFile')}
                                clearButtonText={Msg.localize('uploadAvatarClearFile')}
                            >
                                {this.state.selectedFileUrl && (
                                    <div className="cropper-container">
                                        <img src={this.state.selectedFileUrl}  alt="cropper" />
                                    </div>
                                )}
                            </FileUpload>
                        </FormGroup>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}