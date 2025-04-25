import { IHomeItemProps } from "../../components/HomeItem/homeItem";
import { DataStrucTypes } from "../../types";
import SortPic from '../../assets/homeItemCovers/Sort.jpg';
import StackPic from '../../assets/homeItemCovers/Stack.jpg';
// import LinkedListPic from '../../assets/homeItemCovers/LinkedList.jpg';
import QueuePic from '../../assets/homeItemCovers/Queue.jpg';
import BinarySearchTree from '../../assets/homeItemCovers/BinarySearchTree.jpg';
import BinaryHeap from '../../assets/homeItemCovers/BinaryHeap.jpg'

/** home 的 item 数据配置 */
export const homeItemsConfig: Omit<IHomeItemProps, 'onClick'>[][] = [
    // 第一排
    [
        {
            src: SortPic,
            tags: ['Array', 'Bubble Sort', 'Selection Sort', 'Quick Sort'],
            title: 'Sorting',
            type: DataStrucTypes.Sort
        },
        // {
        //     src: LinkedListPic,
        //     tag: <Tags type={DataStrucTypes.LinkedList} />,
        //     title: 'Linked List',
        //     type: DataStrucTypes.LinkedList
        // },
        {
            src: StackPic,
            tags: ['Stack', 'Push Stack', 'Pop Stack'],
            title: 'Stack',
            type: DataStrucTypes.Stack
        },
        {
            src: QueuePic,
            tags: ['Queue', 'Enqueue', 'Dequeue'],
            title: 'Queue',
            type: DataStrucTypes.Queue
        },
        {
            src: BinaryHeap,
            tags: ['Binary Heap', 'Max Heap'],
            title: 'Binary Heap',
            type: DataStrucTypes.BinaryHeap
        },
        

    ],
    [
        {
            src: BinarySearchTree,
            tags: ['Binary Search Tree', 'Traversal', 'Search'],
            title: 'Binary Search Tree',
            type: DataStrucTypes.BinarySearchTree
        },
        // {
        //     src: BinarySearchTree,
        //     tags: ['Linked List'],
        //     title: 'Linked List',
        //     type: DataStrucTypes.LinkedList
        // },

        // {
        //     src: Pic,
        //     tags: ['哈希表'],
        //     title: '哈希表',
        //     type: DataStrucTypes.HashTable
        // },
        // {
        //     src: BinarySearchTree,
        //     tags: ['Graph'],
        //     title: '图结构',
        //     type: DataStrucTypes.Graph
        // },
    ]
    // 第二排
    // [
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.AVLTree} />,
    //         title: 'AVL树',
    //         type: DataStrucTypes.AVLTree
    //     },
    // ],
    // // 第三排
    // [
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.RedBlackTree} />,
    //         title: '红黑树',
    //         type: DataStrucTypes.RedBlackTree
    //     },
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.BTree} />,
    //         title: 'B树',
    //         type: DataStrucTypes.BTree
    //     },
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.BPlusTree} />,
    //         title: 'B+树',
    //         type: DataStrucTypes.BPlusTree
    //     },
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.Graph} />,
    //         title: '图结构',
    //         type: DataStrucTypes.Graph
    //     },

    // ],
];