import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { css } from '@patternfly/react-styles';
import styles from './Backdrop/backdrop';
import { canUseDOM, getDefaultOUIAId, KEY_CODES, ModalContent, OUIAProps, PickOptional } from '@patternfly/react-core';

export interface ModalProps extends React.HTMLProps<HTMLDivElement>, OUIAProps {
  /** Content rendered inside the Modal. */
  children: React.ReactNode;
  /** Additional classes added to the Modal */
  className?: string;
  /** Flag to show the modal */
  isOpen?: boolean;
  /** Complex header (more than just text), supersedes title for header content */
  header?: React.ReactNode;
  /** Optional help section for the Modal Header */
  help?: React.ReactNode;
  /** Simple text content of the Modal Header, also used for aria-label on the body */
  title?: string;
  /** Optional alert icon (or other) to show before the title of the Modal Header
   * When the predefined alert types are used the default styling
   * will be automatically applied */
  titleIconVariant?: 'success' | 'danger' | 'warning' | 'info' | 'default' | React.ComponentType<any>;
  /** Optional title label text for screen readers */
  titleLabel?: string;
  /** Id to use for Modal Box label */
  'aria-labelledby'?: string;
  /** Accessible descriptor of modal */
  'aria-label'?: string;
  /** Id to use for Modal Box descriptor */
  'aria-describedby'?: string;
  /** Flag to show the close button in the header area of the modal */
  showClose?: boolean;
  /** Custom footer */
  footer?: React.ReactNode;
  /** Action buttons to add to the standard Modal Footer, ignored if `footer` is given */
  actions?: any;
  /** A callback for when the close button is clicked */
  onClose?: () => void;
  /** Default width of the Modal. */
  width?: number | string;
  /** The parent container to append the modal to. Defaults to document.body */
  appendTo?: HTMLElement | (() => HTMLElement);
  /** Flag to disable focus trap */
  disableFocusTrap?: boolean;
  /** Description of the modal */
  description?: React.ReactNode;
  /** Variant of the modal */
  variant?: 'small' | 'medium' | 'large' | 'default';
  /** Alternate position of the modal */
  position?: 'top';
  /** Offset from alternate position. Can be any valid CSS length/percentage */
  positionOffset?: string;
  /** Flag indicating if modal content should be placed in a modal box body wrapper */
  hasNoBodyWrapper?: boolean;
  /** An ID to use for the ModalBox container */
  id?: string;
  /** Modal handles pressing of the Escape key and closes the modal. If you want to handle this yourself you can use this callback function */
  onEscapePress?: (event: KeyboardEvent) => void;
}

export enum ModalVariant {
  small = 'small',
  medium = 'medium',
  large = 'large',
  default = 'default'
}

interface ModalState {
  container?: HTMLElement;
  isOpen: boolean;
  ouiaStateId: string;
}

export class Modal extends React.Component<ModalProps, ModalState> {
  static displayName = 'Modal';
  static currentId = 0;
  boxId = '';
  labelId = '';
  descriptorId = '';
  ignoreIsShow = false;

  static defaultProps: PickOptional<ModalProps> = {
    className: '',
    isOpen: false,
    title: '',
    titleIconVariant: undefined,
    titleLabel: '',
    'aria-label': '',
    showClose: true,
    'aria-describedby': '',
    'aria-labelledby': '',
    id: undefined,
    actions: [] as any[],
    onClose: () => undefined as any,
    variant: 'default',
    hasNoBodyWrapper: false,
    appendTo: () => document.body,
    ouiaSafe: true
  };

  constructor(props: ModalProps) {
    super(props);
    const boxIdNum = Modal.currentId++;
    const labelIdNum = boxIdNum + 1;
    const descriptorIdNum = boxIdNum + 2;
    this.boxId = props.id || `pf-modal-part-${boxIdNum}`;
    this.labelId = `pf-modal-part-${labelIdNum}`;
    this.descriptorId = `pf-modal-part-${descriptorIdNum}`;

    this.state = {
      container: undefined,
      isOpen: props.isOpen ?? false,
      ouiaStateId: getDefaultOUIAId(Modal.displayName, props.variant)
    };
  }

  handleEscKeyClick = (event: KeyboardEvent): void => {
    const { onEscapePress } = this.props;
    if (event.keyCode === KEY_CODES.ESCAPE_KEY && this.state.isOpen) {
      onEscapePress ? onEscapePress(event) : this.handleModalClose();
    }
  };

  handleModalClose = (): void => {
    this.ignoreIsShow = true;
    const { appendTo } = this.props;
    if (appendTo) {
      // show animate
      const target: HTMLElement = this.getElement(appendTo);
      target.classList.remove(css(styles.backdropOpen));
      this.toggleSiblingsFromScreenReaders(false);
    }

    setTimeout(() => {
      if (this.props.onClose) {
        this.props.onClose();
      }
      this.ignoreIsShow = false;
      this.setState({ isOpen: false });
    }, 250);
  };

  getElement = (appendTo: HTMLElement | (() => HTMLElement)) => {
    if (typeof appendTo === 'function') {
      return appendTo();
    }
    return appendTo || document.body;
  };

  toggleSiblingsFromScreenReaders = (hide: boolean) => {
    const { appendTo } = this.props;
    if (appendTo) {
      const target: HTMLElement = this.getElement(appendTo);
      const bodyChildren = target.children;
      for (const child of Array.from(bodyChildren)) {
        if (child !== this.state.container) {
          hide ? child.setAttribute('aria-hidden', '' + hide) : child.removeAttribute('aria-hidden');
        }
      }
    }
  };

  isEmpty = (value?: string | null) => value === null || value === undefined || value === '';

  componentDidMount() {
    const {
      appendTo,
      title,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      hasNoBodyWrapper,
      header
    } = this.props;
    if (appendTo) {
      const target: HTMLElement = this.getElement(appendTo);
      const container = document.createElement('div');
      this.setState({ container });
      target.appendChild(container);
      target.addEventListener('keydown', this.handleEscKeyClick, false);

      if (this.state.isOpen) {
        target.classList.add(css(styles.backdropOpen));
      } else {
        target.classList.remove(css(styles.backdropOpen));
      }

      if (this.isEmpty(title) && this.isEmpty(ariaLabel) && this.isEmpty(ariaLabelledby)) {
        // eslint-disable-next-line no-console
        console.error('Modal: Specify at least one of: title, aria-label, aria-labelledby.');
      }

      if (this.isEmpty(ariaLabel) && this.isEmpty(ariaLabelledby) && (hasNoBodyWrapper || header)) {
        // eslint-disable-next-line no-console
        console.error(
          'Modal: When using hasNoBodyWrapper or setting a custom header, ensure you assign an accessible name to the the modal container with aria-label or aria-labelledby.'
        );
      }
    }
  }

  componentDidUpdate() {
    const { appendTo } = this.props;
    if (!this.ignoreIsShow) {
      if (appendTo) {
        const target: HTMLElement = this.getElement(appendTo);
        if (this.state.isOpen) {
          target.classList.add(css(styles.backdropOpen));
          this.toggleSiblingsFromScreenReaders(true);
        } else {
          this.toggleSiblingsFromScreenReaders(false);
        }
      }
      if (this.props.isOpen != this.state.isOpen) {
        if (this.props.isOpen) {
          this.setState({ isOpen: true });
        } else {
          this.handleModalClose();
        }
      }
    }
  }

  componentWillUnmount() {
    const { appendTo } = this.props;
    if (appendTo) {
      const target: HTMLElement = this.getElement(appendTo);
      if (this.state.container) {
        target.removeChild(this.state.container);
      }
      target.removeEventListener('keydown', this.handleEscKeyClick, false);
      target.classList.remove(css(styles.backdropOpen));
    }
  }

  render() {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      appendTo,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onEscapePress,
      'aria-labelledby': ariaLabelledby,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      title,
      titleIconVariant,
      titleLabel,
      ouiaId,
      ouiaSafe,
      ...props
    } = this.props;
    const { container } = this.state;

    if (!canUseDOM || !container) {
      return null;
    }

    return ReactDOM.createPortal(
      <ModalContent
        {...props}
        boxId={this.boxId}
        labelId={this.labelId}
        descriptorId={this.descriptorId}
        title={title}
        titleIconVariant={titleIconVariant}
        titleLabel={titleLabel}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-labelledby={ariaLabelledby}
        ouiaId={ouiaId !== undefined ? ouiaId : this.state.ouiaStateId}
        ouiaSafe={ouiaSafe}
        isOpen={this.state.isOpen}
        onClose={this.handleModalClose}
      />,
      container
    );
  }
}
