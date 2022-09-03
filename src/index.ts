type Children = Record<string, Node>;
class Node {
  constructor(
    // 节点值
    public key: string,
    // 节点深度
    public depth: number = 0,
    // 是否为单词最后节点
    public isWord: boolean = false,
    // 子节点的引用
    public children: Children = {},
    // 父节点的引用
    public parent: Node | undefined = undefined,
    // failure表，用于失配后的跳转
    public failure: Node | undefined = undefined
  ) {}
}
class Censor {
  constructor(
    private targets: string[] = [],
    public replaceWidth: string = "*",
    public root: Node = new Node("")
  ) {
    this.createTree();
  }
  createTree() {
    this.targets.forEach((keys) => {
      keys.split("").reduce((a, b, index, arr) => {
        let node = a.children[b];
        const isWord = index === arr.length - 1;
        if (!node) {
          node = new Node(b, a.depth + 1, isWord);
          a.children[b] = node;
          a.children[b].parent = a;
        }
        node.isWord = node.isWord || isWord;
        node.failure = this.root;
        return node;
      }, this.root);
    });
    let currentQueue = Object.values(this.root.children);
    while (currentQueue.length) {
      let nextQueue: Node[] = [];
      currentQueue.forEach((node) => {
        const { parent, children, key } = node;
        nextQueue = nextQueue.concat(Object.values(children));
        if (parent) {
          let failure = parent.failure;
          while (failure) {
            if (Object.hasOwn(failure.children, key)) {
              node.failure = failure.children[key];
              failure = undefined;
            } else {
              failure = failure.failure;
            }
          }
        }
      });
      currentQueue = nextQueue;
    }
  }
  filter(
    text: string,
    options: { replace: boolean; replaceWidth?: string } = { replace: false }
  ): { text: string; words: string[]; pass: boolean } {
    const { replace, replaceWidth = this.replaceWidth } = options;
    let pass = true;
    let filterText = "";
    const filterWords = new Set<string>([]);
    let currentNode: Node | undefined = this.root;
    let nextNode: Node | undefined;
    let failure: Node | undefined;
    let textIndex = 0;
    while (currentNode && textIndex < text.length) {
      let w = text[textIndex];
      filterText += w;
      textIndex += 1;
      nextNode = currentNode.children[w];
      if (!nextNode) {
        failure = currentNode.failure;
        while (failure) {
          nextNode = failure.children[w];
          if (nextNode) break;
          failure = failure.failure;
        }
      }

      if (nextNode) {
        failure = nextNode;
        do {
          if (failure.isWord) {
            pass = false;
            if (replace) {
              filterText =
                filterText.slice(0, -failure.depth) +
                replaceWidth.repeat(failure.depth);
            }
            filterWords.add(this.collectWord(failure));
          }
          failure = failure.failure;
        } while (failure && failure.depth !== 0);
        currentNode = nextNode;
      } else {
        currentNode = this.root;
      }
    }
    return {
      text: filterText,
      words: Array.from(filterWords),
      pass,
    };
  }
  collectWord(node: Node) {
    let w: string[] = [];
    let curNode: Node | undefined = node;
    while (curNode) {
      if (curNode.depth !== 0) {
        w.unshift(curNode.key);
        curNode = curNode.parent;
      } else {
        curNode = undefined;
      }
    }
    return w.join("");
  }
}

export { Censor, Node };

export default Censor;
