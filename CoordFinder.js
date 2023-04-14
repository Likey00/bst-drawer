class CoordFinder {
    constructor(bst, width, height) {
        this.bst = bst;
        this.width = width;
        this.height = height;
        this.radius = 0;
        this.relativePositions = {};
        this.finalCoords = {};
    }

    findCoords() {
        this.naivelyAssign();
        this.eliminateOverlap();
        this.computeFinalCoords();
    }
    
    naivelyAssign() {
        const helper = (node, currentPos) => {
            if (node == null) return;
            this.relativePositions[node.val] = currentPos;
            helper(node.left, currentPos-1);
            helper(node.right, currentPos+1);
        }

        helper(this.bst.root, 0);
    }

    eliminateOverlap() {
        const helper = (node) => {
            if (node == null) return;

            helper(node.left);
            helper(node.right);

            let leftmostInRight = this.getLeftmost(node.right);
            let rightmostInLeft = this.getRightmost(node.left);

            let overlaps = 
                Object.keys(leftmostInRight).filter(depth => depth in rightmostInLeft)
                .map(depth => rightmostInLeft[depth] - leftmostInRight[depth]);
            
            if (overlaps.length == 0) return;

            let amountToShift = Math.max(...overlaps) / 2 + 1;
            this.shiftSubtree(node.left, -amountToShift);
            this.shiftSubtree(node.right, amountToShift);
        }

        helper(this.bst.root);
    }

    computeFinalCoords() {
        let numCols = 
            Math.max(...Object.values(this.relativePositions))
            - Math.min(...Object.values(this.relativePositions))
            + 1;
        
        let horizIncrement = this.width / (numCols + 1);
        let vertIncrement = this.height / (this.getDepth() + 2);
        let minPosition = Math.min(...Object.values(this.relativePositions));
        this.radius = Math.min(horizIncrement, vertIncrement) * 0.375;

        const helper = (node, depth) => {
            if (node == null) return;

            let xCoord = horizIncrement*(this.relativePositions[node.val] - minPosition + 1);
            let yCoord = vertIncrement*(depth+1);
            this.finalCoords[node.val] = [xCoord, yCoord];
            
            helper(node.left, depth+1);
            helper(node.right, depth+1);
        }

        helper(this.bst.root, 0);
    }

    getDepth() {
        const helper = (node) => {
            if (node == null) return 0;
            return 1 + Math.max(helper(node.left), helper(node.right));
        }

        return helper(this.bst.root);
    }

    shiftSubtree(node, amt) {
        if (node == null) return;
        this.relativePositions[node.val] += amt;
        this.shiftSubtree(node.left, amt);
        this.shiftSubtree(node.right, amt); 
    }
    
    getLeftmost(node) {
        let depthDict = {};
    
        const helper = (node, depth) => {
            if (node == null) return;
            
            if (!depthDict.hasOwnProperty(depth)) {
                depthDict[depth] = this.relativePositions[node.val];
            }
            
            helper(node.left, depth+1);
            helper(node.right, depth+1);
        }

        helper(node, 0);
        return depthDict;
    }

    getRightmost(node) {
        let depthDict = {};

        const helper = (node, depth) => {
            if (node == null) return;

            if (!depthDict.hasOwnProperty(depth)) {
                depthDict[depth] = this.relativePositions[node.val];
            }

            helper(node.right, depth+1);
            helper(node.left, depth+1);
        }

        helper(node, 0);
        return depthDict;
    }
}