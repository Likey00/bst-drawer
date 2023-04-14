class BST {
    constructor(nums) {
        this.root = null;
        
        for (let val of nums) {
            this.insert(val);
        }
    }
    
    insert(val) {
        if (this.root == null) {
            this.root = new BSTNode(val);
            return;
        }
        
        let currentNode = this.root;
        while (currentNode != null) {
            if (val < currentNode.val) {
                if (currentNode.left == null) {
                    currentNode.left = new BSTNode(val);
                    return;
                }  
                currentNode = currentNode.left;
            }
            else if (val > currentNode.val) {
                if (currentNode.right == null) {
                    currentNode.right = new BSTNode(val);
                    return;
                }
                currentNode = currentNode.right;
            }
            else return;
        }
    } 
}

class BSTNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}