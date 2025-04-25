import { Tag as AntdTag } from 'antd'
import { IBaseProps } from '../../types';
import './tag.scss'

export type TagType = 'Delete' | 'Add' | 'Max Heap' | 'Array' | 'AVL Tree' | 'B+ Tree' | 'B Tree' | 'Binary Search Tree' | 'Graph' | 'Hash Table' | 'Binary Heap' | 'Linked List' | 'Queue' | 'Red-Black Tree' | 'Stack' | 'Sorting' | 'Bubble Sort' | 'Quick Sort' | 'Insertion Sort' | 'Selection Sort' | 'Merge Sort' | 'Traversal' | 'Push Stack' | 'Pop Stack' | 'Enqueue' | 'Dequeue' | 'Search' | 'Binary Search'

export const MainTags: TagType[] = ['Array', 'Hash Table', 'Graph', 'Stack', 'Red-Black Tree', 'Queue', 'Linked List', 'Binary Heap', 'AVL Tree', 'Binary Search Tree', 'B+ Tree', 'B Tree']


interface ITagsProps extends IBaseProps {
    /** 标签组类型 */
    type: TagType
    /** 颜色 */
    // color?: 'geekblue' | 'orange'
    /** 主tag */
    main?: boolean;
}

const Tag: React.FC<ITagsProps> = (props) => {
    const { type, main } = props;
    return (
        <AntdTag color={main ? 'orange' : 'geekblue'}>
            {type}
        </AntdTag>
    )
}

export default Tag;