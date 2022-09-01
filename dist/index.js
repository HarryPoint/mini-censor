var Node = /** @class */ (function () {
    function Node(
    // 节点值
    key, 
    // 节点深度
    depth, 
    // 是否为单词最后节点
    isWord, 
    // 子节点的引用
    children, 
    // 父节点的引用
    parent, 
    // failure表，用于失配后的跳转
    failure) {
        if (depth === void 0) { depth = 0; }
        if (isWord === void 0) { isWord = false; }
        if (children === void 0) { children = {}; }
        if (parent === void 0) { parent = undefined; }
        if (failure === void 0) { failure = undefined; }
        this.key = key;
        this.depth = depth;
        this.isWord = isWord;
        this.children = children;
        this.parent = parent;
        this.failure = failure;
    }
    return Node;
}());
var Censor = /** @class */ (function () {
    function Censor(targets, replaceString, root) {
        if (targets === void 0) { targets = []; }
        if (replaceString === void 0) { replaceString = "*"; }
        if (root === void 0) { root = new Node(""); }
        this.targets = targets;
        this.replaceString = replaceString;
        this.root = root;
        this.createTree();
    }
    Censor.prototype.createTree = function () {
        var _this = this;
        this.targets.forEach(function (keys) {
            keys.split("").reduce(function (a, b, index, arr) {
                var node = a.children[b];
                var isWord = index === arr.length - 1;
                if (!node) {
                    node = new Node(b, a.depth + 1, isWord);
                    a.children[b] = node;
                    a.children[b].parent = a;
                }
                node.isWord = node.isWord || isWord;
                node.failure = _this.root;
                return node;
            }, _this.root);
        });
        var currentQueue = Object.values(this.root.children);
        var _loop_1 = function () {
            var nextQueue = [];
            currentQueue.forEach(function (node) {
                var parent = node.parent, children = node.children, key = node.key;
                nextQueue = nextQueue.concat(Object.values(children));
                if (parent) {
                    var failure = parent.failure;
                    while (failure) {
                        if (Object.hasOwn(failure.children, key)) {
                            node.failure = failure.children[key];
                            failure = undefined;
                        }
                        else {
                            failure = failure.failure;
                        }
                    }
                }
            });
            currentQueue = nextQueue;
        };
        while (currentQueue.length) {
            _loop_1();
        }
    };
    Censor.prototype.filter = function (text, options) {
        if (options === void 0) { options = { replace: false }; }
        var replace = options.replace, _a = options.replaceString, replaceString = _a === void 0 ? this.replaceString : _a;
        var pass = true;
        var filterText = "";
        var filterWords = new Set([]);
        var currentNode = this.root;
        var textIndex = 0;
        while (currentNode && textIndex < text.length) {
            var w = text[textIndex];
            filterText += w;
            textIndex += 1;
            if (Object.hasOwn(currentNode.children, w)) {
                currentNode = currentNode.children[w];
                if (currentNode.isWord) {
                    pass = false;
                    if (replace) {
                        filterText =
                            filterText.slice(0, -currentNode.depth) +
                                replaceString.repeat(currentNode.depth);
                    }
                    filterWords.add(this.collectWord(currentNode));
                    currentNode = currentNode.failure;
                }
            }
            else if (currentNode.depth !== 0) {
                currentNode = currentNode.failure;
            }
        }
        return {
            text: filterText,
            words: Array.from(filterWords),
            pass: pass,
        };
    };
    Censor.prototype.collectWord = function (node) {
        var w = [];
        var curNode = node;
        while (curNode) {
            if (curNode.depth !== 0) {
                w.unshift(curNode.key);
                curNode = curNode.parent;
            }
            else {
                curNode = undefined;
            }
        }
        return w.join("");
    };
    return Censor;
}());
export { Censor, Node };
export default Censor;
//# sourceMappingURL=index.js.map