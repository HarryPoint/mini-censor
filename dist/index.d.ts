declare type Children = Record<string, Node>;
declare class Node {
    key: string;
    depth: number;
    isWord: boolean;
    children: Children;
    parent: Node | undefined;
    failure: Node | undefined;
    constructor(key: string, depth?: number, isWord?: boolean, children?: Children, parent?: Node | undefined, failure?: Node | undefined);
}
declare class Censor {
    private targets;
    replaceString: string;
    root: Node;
    constructor(targets?: string[], replaceString?: string, root?: Node);
    createTree(): void;
    filter(text: string, options?: {
        replace: boolean;
        replaceString?: string;
    }): {
        text: string;
        words: string[];
        pass: boolean;
    };
    collectWord(node: Node): string;
}
export { Censor, Node };
export default Censor;
