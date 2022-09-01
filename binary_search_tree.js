class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(num) {
        this.array = this.mergeSort(this.removeDuplicates(this.createRandomArray(num)));
        this.root = this.buildTree(this.array, 0, this.array.length - 1);
    }

    createRandomArray(num) {
        const result = [];
        for (let i = 0; i < num; i++) {
            result.push(Math.ceil(Math.random() * 100))
        }
        return result;
    }

    buildTree(arr, start, end) {
        if (start > end) return null;
        const mid = Math.floor((start + end) / 2);
        const node = new Node(arr[mid]);
        node.left = this.buildTree(arr, start, mid - 1);
        node.right = this.buildTree(arr, mid + 1, end);
        return node;
    }

    insert(data, node = this.root) {
        if (node === null) {
            node = new Node(data);
            return node;
        }
        if (data < node.data) {
            node.left = this.insert(data, node.left);
        } else if (data > node.data) {
            node.right = this.insert(data, node.right);
        }
        return node;
    }

    deleteRec(data, node = this.root) {
        if (node === null) return node;
        if (data < node.data) {
            node.left = this.deleteRec(data, node.left);
        } else if (data > node.data) {
            node.right = this.deleteRec(data, node.right);
        } else {
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;
            node.data = this.findSuccessor(node.right);
            node.right = this.deleteRec(node.data, node.right);
        }
        return node;
    }

    find(data, node = this.root) {
        if (node === null || node.data === data) return node;
        if (data < node.data) return this.find(data, node.left);
        return this.find(data, node.right);
    }

    findSuccessor(node) {
        let successor = node.data;
        while (node.left !== null) {
            successor = node.left.data;
            node = node.left;
        }
        return successor;
    }

    levelOrderIter(node = this.root, cb = null) {
        if (node === null) return node;
        const queue = [];
        const result = [];
        queue.push(node);
        while (queue.length > 0) {
            const current = queue.shift();
            result.push(current.data);
            if (current.left !== null) queue.push(current.left);
            if (current.right !== null) queue.push(current.right);
            if (cb !== null) cb(current);
        }
        return cb === null ? result : node;
    }

    levelOrderRec(node = this.root, cb = null, arr = [node]) {
        if (arr.length === 0) return arr;
        const nextLevel = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].left !== null) nextLevel.push(arr[i].left);
            if (arr[i].right !== null) nextLevel.push(arr[i].right);
            if (cb !== null) cb(arr[i]);
        }
        return cb === null
            ? [
                  ...arr.map((e) => (e = e.data)),
                  ...this.levelOrderRec(node, cb, nextLevel),
              ]
            : this.levelOrderRec(node, cb, nextLevel);
    }

    inOrder(node = this.root, cb = null) {
        const result = [];
        const traverseRec = (node) => {
            if (node.left !== null) traverseRec(node.left);
            if (cb !== null) cb(node);
            result.push(node.data);
            if (node.right !== null) traverseRec(node.right);
        };
        traverseRec(node);
        return cb === null ? result : node;
    }

    preOrder(node = this.root, cb = null) {
        const result = [];
        const traverseRec = (node) => {
            if (cb !== null) cb(node);
            result.push(node.data);
            if (node.left !== null) traverseRec(node.left);
            if (node.right !== null) traverseRec(node.right);
        };
        traverseRec(node);
        return cb === null ? result : node;
    }

    postOrder(node= this.root, cb = null) {
        const result = [];
        const traverseRec = (node) => {
            if (node.left !== null) traverseRec(node.left);
            if (node.right !== null) traverseRec(node.right);
            if (cb !== null) cb(node);
            result.push(node.data);
        };
        traverseRec(node);
        return cb === null ? result : node;
    }

    height(node) {
        if (node === null) return -1;
        return 1 + Math.max(this.height(node.right), this.height(node.right));
    }

    depth(node, root = this.root) {
        if (root === node) return 0;
        if (node.data < root.data) return 1 + this.depth(node, root.left);
        return 1 + this.depth(node, root.right);
    }

    isBalanced(root = this.root) {
        if (root === null) return true;
        const lh = this.height(root.left);
        const rh = this.height(root.right);
        if (
            Math.abs(lh - rh) <= 1 &&
            this.isBalanced(root.left) === true &&
            this.isBalanced(root.right) === true
        ) {
            return true;
        }
        return false;
    }

    rebalance() {
        if(this.isBalanced === true) return this.root;
        this.array = this.inOrder(this.root);
        this.root = this.buildTree(this.array, 0, this.array.length - 1);
        return this.root;
    }

    prettyPrint(node = this.root, prefix = "", isLeft = true) {
        if (node.right !== null) {
            this.prettyPrint(
                node.right,
                `${prefix}${isLeft ? "│   " : "    "}`,
                false
            );
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.left !== null) {
            this.prettyPrint(
                node.left,
                `${prefix}${isLeft ? "    " : "│   "}`,
                true
            );
        }
    }

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    mergeSort(arr) {
        if (arr.length <= 1) return arr;
        const result = [];
        const midPoint = Math.floor(arr.length / 2);
        const leftHalf = this.mergeSort(arr.slice(0, midPoint));
        const rightHalf = this.mergeSort(arr.slice(midPoint));
        while (leftHalf.length > 0 && rightHalf.length > 0) {
            const nextArrToPush =
                leftHalf[0] < rightHalf[0] ? leftHalf : rightHalf;
            result.push(nextArrToPush.shift());
        }
        return [...result, ...leftHalf, ...rightHalf];
    }
}

const tree = new Tree(13); // generate 13 random numbers 1-100 and create from them a tree
tree.prettyPrint()
console.log('Tree is balanced = ' + tree.isBalanced());
console.log('Elements in level order = ' + tree.levelOrderIter());
console.log('Elements in order = ' + tree.inOrder());
console.log('Elements pre order = ' + tree.preOrder());
console.log('Elements post order = ' + tree.postOrder());
tree.insert(101);
tree.insert(102);
tree.insert(103);
console.log('Tree is balanced = ' + tree.isBalanced());
tree.rebalance();
console.log('Tree is balanced = ' + tree.isBalanced());
tree.prettyPrint()
console.log('Tree is balanced = ' + tree.isBalanced());
console.log('Elements in level order = ' + tree.levelOrderIter());
console.log('Elements in order = ' + tree.inOrder());
console.log('Elements pre order = ' + tree.preOrder());
console.log('Elements post order = ' + tree.postOrder());
