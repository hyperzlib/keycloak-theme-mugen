import sys

def parseProperties(content: str, getDict: bool = False):
    """读取properties文件

    Args:
        content (str): properties内容
    """
    content = content.replace("\r\n", "\n")
    lines = content.split("\n")

    if getDict:
        prop = {}
        for line in lines:
            if line.startswith("#"): # 注释
                pass
            elif line.strip() == "": # 空行
                pass
            else: # 正常属性
                delimiterPos = line.find("=")
                if delimiterPos == -1:
                    pass
                else:
                    prop[line[0:delimiterPos]] = line[delimiterPos + 1:]
        return prop
    else:
        prop = []
        for line in lines:
            if line.startswith("#"): # 注释
                prop.append({
                    't': 'a',
                    'v': line[1:].strip(),
                })
            elif line.strip() == "": # 空行
                prop.append({
                    't': 'e',
                })
            else: # 正常属性
                delimiterPos = line.find("=")
                if delimiterPos == -1:
                    prop.append({
                        't': 't',
                        'v': line,
                    })
                else:
                    prop.append({
                        't': 'p',
                        'k': line[0:delimiterPos],
                        'v': line[delimiterPos + 1:],
                    })
        return prop

def generateProperties(prop):
    ret = []
    for item in prop:
        if item['t'] == 'a':
            ret.append("# %s" % item['v'])
        elif item['t'] == 'e':
            ret.append("")
        elif item['t'] == 't':
            ret.append(item['v'])
        elif item['t'] == 'p':
            ret.append("%s=%s" % (item['k'], item['v']))
    return "\n".join(ret)


if __name__ == "__main__":
    if (len(sys.argv) < 4):
        print("Usage python3 %s <template file> <mixins file> <output file>" % sys.argv[0])

    tplFile = sys.argv[1]
    mixinsFile = sys.argv[2]
    outputFile = sys.argv[3]

    template = []
    mixins = {}
    ret = []

    with open(tplFile, "r", encoding="utf-8") as fp:
        content = fp.read()
        template = parseProperties(content)

    with open(mixinsFile, "r", encoding="utf-8") as fp:
        content = fp.read()
        mixins = parseProperties(content, True)

    for id in range(0, len(template)):
        item = template[id]
        if item['t'] == 'p':
            key = item['k']
            if key in mixins:
                item['v'] = mixins[key]
        ret.append(item)

    retProperties = generateProperties(ret)

    with open(outputFile, "w", encoding="utf-8") as fp:
        fp.write("# encoding: utf-8\n")
        fp.write(retProperties)

    print("Generate success")