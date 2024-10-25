// 1. Build a Node class/factory. It should have an attribute for the data it stores as well as its left and right children.

class Node{
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// 2. Build a Tree class/factory which accepts an array when initialized. The Tree class should have a root attribute, 
// which uses the return value of buildTree which you’ll write next.

class Tree{
    constructor(arr) {
        arr = [...new Set(arr.toSorted((a, b) => a-b))];
        this.root = buildTree(0, arr.length - 1 , arr);
    }

// Write insert(value) and deleteItem(value) functions that insert/delete the given value. 
// You’ll have to deal with several cases for delete, such as when a node has children or not. 
// If you need additional resources, check out these two articles on inserting and deleting, or this video on BST inserting/removing with several visual examples.

    insert(value) {
      let tmp = this.root;
      let parent = null;
      while( tmp != null ) {
        if( value === tmp.value ) {
          return;
        }
        parent = tmp;
        if(value > tmp.value) {
          tmp = tmp.right;
        } else if(value < tmp.value) {
          tmp = tmp.left;
        }
      }
      if(parent.value > value) {
        parent.left = new Node(value)
      }
      if(parent.value < value) {
        parent.right = new Node(value);
      }
    }

    deleteItem(value) {
      let tmp = this.root;
      let parent = null;
      while( tmp != null && tmp.value != value ) {
        parent = tmp;
        if(value > tmp.value) {
          tmp = tmp.right;
        } else if(value < tmp.value) {
          tmp = tmp.left;
        }
      }
      if(tmp == null) {
        return;
      }
      //deleting a leaf left && right == null
      if(tmp.right == null && tmp.left == null) {
        if((parent.right != null) && (parent.right.value == value)) {
          parent.right = null;
        } else if( (parent.left != null) && (parent.left.value == value)) {
          parent.left = null;
        }
      }
      //deleting a node that has only one child 
      if((tmp.left != null && tmp.right == null )) {
        // daca left == null, parent.next = child.right
        if((parent.right != null) && (parent.right.value == value)) {
          parent.right = tmp.left;
        } else if( (parent.left != null) && (parent.left.value == value)) {
          parent.left = tmp.left;
        }
      } else if(tmp.right != null && tmp.left == null) {
        // daca right == null, parent.next = child.left
        if((parent.right != null) && (parent.right.value == value)) {
          parent.right = tmp.right;
        } else if( (parent.left != null) && (parent.left.value == value)) {
          parent.left = tmp.right;
        }
      }
      // deleting a node that has two children
      if((tmp.left != null && tmp.right != null )) {
        console.log("am intrat in cazul cu 2 children nodes")
        let parentOfSmallestBigger = tmp;
        let smallestBigger = tmp.right;
        while(smallestBigger.left != null) {
          parentOfSmallestBigger = smallestBigger;
          smallestBigger = smallestBigger.left;
        }
        // parentOfSmallestBigger.left = smallestBigger.right;
        // tmp.left = smallestBigger.left;
        //avem 2 cazuri, daca parent == parent of the smallest bigger
        console.log("inainte de if, avem tmp " + tmp.value + " si parent of smallest bigger " + parentOfSmallestBigger.value)
        if(tmp.value == parentOfSmallestBigger.value) {
          tmp.value = smallestBigger.value;
          tmp.right = smallestBigger.right;
        } else {
          // sau daca parent != parent of the smallest bigger
          tmp.value = smallestBigger.value;
          parentOfSmallestBigger.left = smallestBigger.right
        }
      }
    }
    find(value) {
      let tmp = this.root;
      while(tmp != null) {
        if(tmp.value == value) {
          return tmp;
        }
        if(tmp.value > value) {
          tmp = tmp.left;
        } else {
          tmp = tmp.right;
        }
      }
      return "elementul nu se afla in arbore";
    }
    // Write a levelOrder(callback) function that accepts a callback function as its parameter. 
    // levelOrder should traverse the tree in breadth-first level order and call the callback on each node as it traverses,
    // passing the whole node as an argument, similarly to how Array.prototype.forEach might work for arrays.
    // levelOrder may be implemented using either iteration or recursion (try implementing both!).
    // If no callback function is provided, throw an Error reporting that a callback is required.
    // Tip: You will want to use an array acting as a queue to keep track of all the child nodes that you have yet to traverse and to add new ones to the list
    levelOrder( callback ) { // bredth-first
      if( typeof(callback) !== "function") {
        throw new Error("a callback is required");
      }
      if(this.root == null) {
        return;
      }
      let tmp = this.root;
      let queue = [];
      queue.push(tmp);
      while(queue.length != 0) {
        callback(queue[0].value);
        if(queue[0].left != null) {
          queue.push(queue[0].left)
        }
        if(queue[0].right != null) {
          queue.push(queue[0].right)
        }
        queue.shift();
      }
      //levelOrder should traverse the tree in breadth-first level order and call the callback on each node as it traverses
    }
    preOrder(callback) { //depth-first root -> left -> right
      if( typeof(callback) !== "function") {
        throw new Error("a callback is required");
      }
      if(this.root == null) {
        return;
      }
      let stack = [];
      stack.push(this.root);
      while(stack.length) {
        let myNode = stack.pop();
        callback(myNode.value)
        if(myNode.right != null) {
          stack.push(myNode.right)
        }
        if(myNode.left != null) {
          stack.push(myNode.left);
        }
      }
    }
    inOrder(callback) { //depth-first left -> root -> right
      if( typeof(callback) !== "function") {
        throw new Error("a callback is required");
      }
      if(this.root == null) {
        return;
      }
      let tmp = this.root;
      let stack = [];
      while(stack.length || tmp != null) {
        while(tmp) {
          stack.push(tmp)
          tmp = tmp.left;
        }
        let myNode = stack.pop();
        callback(myNode.value);
        tmp = myNode.right;
      }
    }
    postOrder(callback) { //depth-first left -> right -> root
      if( typeof(callback) !== "function") {
        throw new Error("a callback is required");
      }
      if(this.root == null) {
        return;
      }
      let stack = [];
      let visited = new Set();
      stack.push(this.root);
      while(stack.length) {
        let myNode = stack[stack.length - 1]
        if(myNode.left && !visited.has(myNode.left)) {
          stack.push(myNode.left)
        } else if(myNode.right && !visited.has(myNode.right)) {
          stack.push(myNode.right)
        } else {
          visited.add(myNode);
          callback(stack.pop().value);
        }
      }
    }
    height(node) { // number of edges in the longest path from a given node to a leaf node.
      let height = 0;
      let leftHeight = 0;
      let rightHeight = 0;
      if(node.left != null) {
        leftHeight = 1 + this.height(node.left)
      }
      if(node.right != null) {
        rightHeight = 1 + this.height(node.right)
      }
      if(rightHeight > leftHeight) {
        height = rightHeight;
      } else {
        height = leftHeight;
      }
      return height;
    }
    depth(node) { // number of edges in the path from a given node to the tree’s root node.
      // reversing this, means coming form the root towards the node.
      let depth = 0;
      let tmp = this.root;
      while(tmp.value != node.value && tmp != null) {
        depth++;
        if(tmp.value < node.value) {
          tmp = tmp.right;
        } else {
          tmp = tmp.left;
        }
      }
      if(tmp == null) {
        return "Node does not exist in this tree";
      } else {
        return depth;
      }
    }
    isBalanced(node) { //checks if the tree is balanced
      // difference between heights of the left subtree and the right subtree of every node is not more than 1
      let myResult = this.checkBalanced(node)
      if(myResult === false) {
        return false;
      } else {
        return true;
      }
    }
    checkBalanced(node) {
      let height = 0;
      let leftHeight = 0;
      let rightHeight = 0;
      if(node.left != null) {
        let result = this.checkBalanced(node.left)
        if(result === false) {
          return false;
        }
        leftHeight = 1 + result;
      }
      if(node.right != null) {
        let result = this.checkBalanced(node.right)
        if(result === false) {
          return false;
        }
        rightHeight = 1 + result;
      }
      let difference = 0;
      if(rightHeight > leftHeight) {
        difference = rightHeight - leftHeight;
        height = rightHeight;
      } else {
        difference = leftHeight - rightHeight;
        height = leftHeight;
      }
      if(difference > 1) {
        return false;
      }
      return height;
    }
    rebalance() {
      let newArray = [];
      function addElementToNewArray(elem) {
        newArray.push(elem)
      }
      this.inOrder(addElementToNewArray)
      this.root = buildTree(0, newArray.length-1, newArray)
    }
}

function callback(elem) {
  console.log(elem);
}

// Write a buildTree(array) function that takes an array of data (e.g., [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]) and turns it into a balanced
//  binary tree full of Node objects appropriately placed (don’t forget to sort and remove duplicates!). The buildTree function should return the level-0 root node.
function buildTree(start, end, arr) {
  if(start > end) {
      return null;
  }
  let mid = start + Math.floor((end - start) / 2);
  let myroot = new Node(arr[mid]);
  myroot.left = buildTree(start, mid - 1, arr)
  myroot.right = buildTree(mid + 1, end, arr);
  return myroot;
}

let myTree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 96, 13, 55, 22, 23, 46, 88, 92, 12, 32, 22, 25, 36, 37, 33, 66])

// let myTree = new Tree([1, 2, 3]);

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  console.log(myTree.isBalanced(myTree.root))
  console.log("level order below")
  myTree.levelOrder(callback);
  console.log("preorder below")
  myTree.preOrder(callback);
  console.log("inorder below")
  myTree.inOrder(callback);
  console.log("postorder below")
  myTree.postOrder(callback);
  myTree.insert(120)
  myTree.insert(144)
  myTree.insert(521)
  myTree.insert(252)
  myTree.insert(623)
  console.log("prettyPrint below after unbalancing the tree by adding some numbers > 100")
  prettyPrint(myTree.root);
  console.log("is tree balanced? " + myTree.isBalanced(myTree.root))
  console.log("after rebalancing the tree, prettyPrint looks like this:");
  myTree.rebalance();
  prettyPrint(myTree.root)
  console.log("is tree balanced? " + myTree.isBalanced(myTree.root))
  console.log("level order below")
  myTree.levelOrder(callback);
  console.log("preorder below")
  myTree.preOrder(callback);
  console.log("inorder below")
  myTree.inOrder(callback);
  console.log("postorder below")
  myTree.postOrder(callback);