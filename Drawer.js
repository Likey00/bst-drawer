window.onload = init;

function init() {
    let canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    
    document.getElementById('randomBtn').addEventListener("click", function(e) {
        if (e.preventDefault) e.preventDefault();

        let unshuffled = [...Array(50).keys()];
        let shuffled = unshuffled
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value.toString())
            .join(" ");
        
        let textbox = document.getElementById('numList');
        textbox.value = shuffled;
    });

    document.getElementById('drawBtn').addEventListener("click", function(e) {
        if (e.preventDefault) e.preventDefault();

        let textbox = document.getElementById('numList');
        let numList = textbox.value;
        numList = numList.trim().split(" ").map(num => parseInt(num)).filter(num => !isNaN(num));
    
        let bst = new BST(numList);
        let coordFinder = new CoordFinder(bst, canvas.width, canvas.height);
        coordFinder.findCoords();
        let nodeToCoord = coordFinder.finalCoords;
    
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        ctx.font = coordFinder.radius + "px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    
        drawCircles();
        ctx.fillStyle = "white";
    
        function drawCircles() {
            helper(bst.root);
    
            function helper(node) {
                if (node == null) return;
                let [x, y] = nodeToCoord[node.val];
    
                if (node.left != null) {
                    let [xl, yl] = nodeToCoord[node.left.val];
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(xl, yl);
                    ctx.stroke();            
                }
                if (node.right != null) {
                    let [xr, yr] = nodeToCoord[node.right.val];
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(xr, yr);
                    ctx.stroke();            
                }
                
                ctx.beginPath();
                ctx.arc(x, y, coordFinder.radius, 0, 2*Math.PI);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.fillStyle = "black";
                ctx.stroke();
    
                ctx.fillText(node.val, x, y);
                helper(node.left);
                helper(node.right);
            }
        }
    });
}