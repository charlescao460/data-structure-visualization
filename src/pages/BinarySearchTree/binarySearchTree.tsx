import React, { useEffect, useReducer, useState } from 'react'
import { useHistory } from 'react-router'
import { Text } from '@react-three/drei'
import { Button, PageHeader, Steps, message } from 'antd'
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons'
import Console, { Item, SubMenu } from '../../components/Console/console'
import Scene3d from '../../components/Scene3d/scene3d'
import { ActionTypes, IAction, IReducer, OpeDetailTypes, SeqType } from '../../types'
import { cdnOfNodes } from './config'
import { initState, IState, reducer } from './store'
import BSTSphere3d from './BSTSphere3d/bstSphere3d'
import { root } from '../../configs/router/config'
import { addNodeSeq, deleteNodeSeq, randomBST, searchSeq } from './utils'
import { getDeepthByNodeIndex, getLChildValue, getRChildValue, getSubTree, initSeq, initSpheres, inOrderSeq, parseValue, postOrderSeq, preOrderSeq, treeToString } from '../../utils/binaryTree'
import config from './config'
import { excuteSeq } from '../../utils'

const { Step } = Steps;

const BinarySearchTree = () => {
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
            spheres: initSpheres(initState.binaryTree),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: treeToString(initState.binaryTree) }]
        }
    });

    /** Whether the scene is loaded */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** Handle the scene loaded callback */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** Render the input data */
    const handleRender = (value: string) => {
        const parseRes = parseValue(value);
        console.log(parseRes);
        if (parseRes) {
            let sequence = initSeq(parseRes);
            excuteSeq(sequence, config.animationSpeed, dispatch);
        } else {
            message.warning('Invalid data format. Please input in a format like "[1,3,8,2]"')
        }
    }

    /** Add an element */
    const handleAddEle = (index: number, value: number) => {
        dispatch({ type: ActionTypes.UnLock })
        let sequence: SeqType = [];
        addNodeSeq(state.binaryTree, 0, value, sequence);

        // Check if the level of the last element to be added is less than or equal to the maximum level in the configuration
        if (getDeepthByNodeIndex(sequence[sequence.length - 2][0].payload) === config.maxDeepth) {
            setTimeout(() => {
                message.warning(`Failed to add. The maximum level of the binary tree is ${config.maxDeepth + 1}`)
            }, sequence.length * config.animationSpeed)
        }
        excuteSeq(sequence, config.animationSpeed, dispatch)
    }

    /** Delete an element */
    const handleDeleteEle = (index: number) => {
        dispatch({ type: ActionTypes.UnLock })

        // Validate the input index
        if (!state.binaryTree[index] && state.binaryTree[index] !== 0) {
            return message.warning('Failed to delete. The input node index does not exist')
        }

        let sequence: SeqType = [];
        deleteNodeSeq(state.binaryTree, index, 0, sequence);

        excuteSeq(sequence, config.animationSpeed, dispatch)
    }

    /** Search for an element */
    const handleSearch = (index: number, value: number) => {
        dispatch({ type: ActionTypes.UnLock })

        let sequence: SeqType = [];
        searchSeq(state.binaryTree, value, 0, sequence);
        excuteSeq(sequence, config.animationSpeed, dispatch);

        // If the value of the last operation's index is not equal to the target value, it means the target element was not found
        if (state.binaryTree[([...sequence].pop() as IAction[])[0].payload] !== value) {
            setTimeout(() => {
                message.warning(`The element with the value ${value} was not found`);
            }, (sequence.length) * config.animationSpeed)
        }
    }

    /** Handle random elements */
    const handleRandom = () => {
        let sequence = initSeq(randomBST(config.geoNumRange, config.geoValueRange, config.maxDeepth));
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** Preorder traversal */
    const handlePreorder = () => {

        let sequence: SeqType = [];
        preOrderSeq(state.binaryTree, 0, sequence);

        // Get the traversal result
        const preOrderRes: number[] = [];
        sequence.forEach((event) => {
            if (event[0].type === ActionTypes.Active) preOrderRes.push(state.binaryTree[event[0].payload] as number)
        })

        dispatch({ type: ActionTypes.StartPreorder, payload: preOrderRes });
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** Inorder traversal */
    const handleInorder = () => {
        let sequence: SeqType = [];
        inOrderSeq(state.binaryTree, 0, sequence);

        // Get the traversal result
        const inOrderRes: number[] = [];
        sequence.forEach((events) => {
            if (events[0].type === ActionTypes.Active) inOrderRes.push(state.binaryTree[events[0].payload] as number)
        })

        dispatch({ type: ActionTypes.StartInOrder, payload: inOrderRes });
        excuteSeq(sequence, config.animationSpeed, dispatch);

    }

    /** Postorder traversal */
    const handlePostorder = () => {
        let sequence: SeqType = [];
        postOrderSeq(state.binaryTree, 0, sequence);
        const postOrderRes: number[] = [];
        sequence.forEach((events) => {
            if (events[0].type === ActionTypes.Active) postOrderRes.push(state.binaryTree[events[0].payload] as number)
        })
        dispatch({ type: ActionTypes.StartPostOrder, payload: postOrderRes });
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** Handle animation speed change */
    const handleSliderChange = (x: number) => {
        config.animationSpeed = -7.95 * x + 1000
    }


    useEffect(() => {
        console.log(state.spheres.map((sphere, i) => ({ index: i, value: sphere.value, sortIndex: sphere.sortIndex, sortIndexes: sphere.sortIndexes.toString() })));
        console.log(state.binaryTree);
    }, [state.spheres])

    return (
        <div className='binarySearchTree-warp'>
            <PageHeader
                onBack={() => {
                    history.replace(root)
                    window.location.reload();
                }}
                title='Binary Search Tree'
            />
            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >
                    {state.spheres.map((sphere, i) => {
                        // Check if the current node has a left child
                        const hasLChild = getLChildValue(state.spheres, sphere.sortIndex)?.value;

                        // Get the position of the left child (adding this check to set the line connecting to the parent node to null when deleting an element)
                        const lChildPos = sphere.lChildPos !== null && getLChildValue(cdnOfNodes, sphere.sortIndex);

                        // Check if the current node has a right child
                        const hasRChild = getRChildValue(state.spheres, sphere.sortIndex)?.value;

                        // Get the position of the right child
                        const rChildPos = sphere.rChildPos !== null && getRChildValue(cdnOfNodes, sphere.sortIndex);

                        return (
                            sphere.value && (
                                <React.Fragment key={'sphere' + sphere.sortIndex}>
                                    <BSTSphere3d
                                        value={sphere.value}
                                        sortIndex={sphere.sortIndex}
                                        sortIndexes={sphere.sortIndexes}
                                        position={cdnOfNodes[sphere.sortIndex]}
                                        isActive={sphere.isActive}
                                        activeLeft={sphere.activeLeft}
                                        activeRight={sphere.activeRight}
                                        isLock={sphere.isLock}
                                        disappear={sphere.disappear}
                                        lChildPos={hasLChild && lChildPos}
                                        rChildPos={hasRChild && rChildPos}
                                    />
                                    <Text
                                        position={[cdnOfNodes[i][0], cdnOfNodes[i][1] - 1.2, cdnOfNodes[i][2]]}
                                        fontSize={0.4}
                                        fillOpacity={!sphere.indexDisappear && !sphere.disappear && !state.disappearAll ? 1 : 0}
                                        color='black'
                                    >
                                        {sphere.sortIndex}
                                    </Text>
                                </React.Fragment>
                            )
                        )
                    })}
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'flex' : 'none' }}
                    radioGroup={[1, 1, 1]}
                    addConfig={{
                        hasIndex: false,
                        hasValue: true,
                        valueRange: config.geoValueRange,
                        radioName: 'Add'
                    }}
                    deleteConfig={{
                        hasIndex: true,
                        hasValue: false,
                        indexRange: [0, state.binaryTree.length - 1],
                        radioName: 'Delete'
                    }}
                    searchConfig={{
                        hasIndex: false,
                        hasValue: true,
                        valueRange: config.geoValueRange,
                        radioName: 'Search'
                    }}
                    onSliderChange={handleSliderChange}
                    onAdd={handleAddEle}
                    onDelete={handleDeleteEle}
                    onSearch={handleSearch}
                    onRender={handleRender}
                    spinning={state.loading}
                    operation={
                        <div className='btn-group'>
                            <div className='row'>
                                <Button icon={<BarChartOutlined />} onClick={handleRandom}>Random Generate</Button>
                                <Button icon={<BarChartOutlined />} onClick={handlePreorder}>Preorder Traversal</Button>
                                <Button icon={<BarChartOutlined />} onClick={handleInorder}>Inorder Traversal</Button>
                                <Button icon={<BarChartOutlined />} onClick={handlePostorder}>Postorder Traversal</Button>
                            </div>
                        </div>
                    }

                    displayer={
                        <Steps direction="vertical" size="small" current={state.opeDetails.length - 1}>
                            {state.opeDetails.map((item, i) => {
                                const { type, payload } = item;
                                switch (type) {
                                    case OpeDetailTypes.InOrderDetails:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Inorder Traversal: [${payload}]`}
                                            />
                                        )

                                    case OpeDetailTypes.PreOrderDetails:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Preorder Traversal: [${payload}]`}
                                            />
                                        )

                                    case OpeDetailTypes.PostOrderDetails:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Postorder Traversal: [${payload}]`}
                                            />
                                        )

                                    case OpeDetailTypes.Add: {
                                        const { index, value, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Add Node: i=${index}, v=${value}`}
                                                description={`Current Binary Tree: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    case OpeDetailTypes.Delete: {
                                        const { index, value, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Delete Node: i=${index}, v=${value}`}
                                                description={`Current Binary Tree: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    default:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Current Binary Tree: ${payload}`}
                                            />
                                        )
                                }
                            })}
                        </Steps>
                    }
                >
                    <Item
                        key='item1'
                        icon={<DotChartOutlined />}
                        onClick={handleRandom}
                    >
                        Random Generate
                    </Item>

                    {/* <SubMenu
                        key='item2'
                        icon={<BarChartOutlined />}
                        title='Traversal'
                    >
                        <Item onClick={handlePreorder}>Preorder Traversal</Item>
                        <Item onClick={handleInorder}>Inorder Traversal</Item>
                        <Item onClick={handlePostorder}>Postorder Traversal</Item>
                    </SubMenu> */}
                </Console>

            </div>
        </div>
    )
}

export default BinarySearchTree;
