import React, { useReducer, useState } from 'react'
import { useHistory } from 'react-router'
import { Text } from '@react-three/drei'
import { Button, PageHeader, Steps, message } from 'antd'
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons'
import Console, { Item, SubMenu } from '../../components/Console/console'
import Scene3d from '../../components/Scene3d/scene3d'
import { ActionTypes, IReducer, OpeDetailTypes } from '../../types'
import { cdnOfNodes } from './config'
import { initState, IState, reducer } from './store'
import BinaryHeapSphere3d from './BinaryHeapSphere3d/binaryHeapSphere3d'
import config from './config'
import { root } from '../../configs/router/config'
import { getLChildValue, getMaxDeepth, getRChildValue, initSeq, initSpheres, parseValue, treeToString } from '../../utils/binaryTree'
import { excuteSeq } from '../../utils'
import { addSeq, randomBh } from './utils'

const { Step } = Steps;

const BinaryHeap = () => {
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
            geometries: initSpheres(state.values),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: treeToString(state.values) }]
        }
    });

    /** Whether the scene is loaded */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** Handle scene loaded callback */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    const handleRender = (value: string) => {
        const parseRes = parseValue(value);
        if (parseRes) {
            let sequence = initSeq(parseRes);
            excuteSeq(sequence, config.animationSpeed, dispatch);
        } else {
            message.warning('Invalid data format, please input in a format like "[1,3,8,2]"')
        }
    }

    /** Add element */
    const handleAddEle = (index: number, value: number) => {
        if (getMaxDeepth(state.values) === 4) {
            message.warning('Failed to add, the maximum depth of the binary heap is 4')
        } else {
            let sequence = addSeq(state.values, value);
            excuteSeq(sequence, config.animationSpeed, dispatch)
        }
    }

    /** Generate random data */
    const handleRandom = () => {
        let sequence = initSeq(randomBh(config.geoNumRange, config.geoValueRange));
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** Handle animation speed change */
    const handleSliderChange = (x: number) => {
        config.animationSpeed = -7.95 * x + 1000
    }


    return (
        <div className='binaryHeap-warp'>
            <PageHeader
                onBack={() => {
                    history.replace(root)
                    window.location.reload();
                }}
                title='Binary Heap'
            />
            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >
                    {state.geometries.map((sphere, i) => {
                        // Check if the current node has a left child
                        const hasLChild = getLChildValue(state.geometries, sphere.sortIndex)?.value;

                        // Get the position of the left child (adding this condition is to set the line connecting the parent node to null when deleting an element)
                        const lChildPos = sphere.lChildPos !== null && getLChildValue(cdnOfNodes, sphere.sortIndex);

                        // Check if the current node has a right child
                        const hasRChild = sphere.rChildPos !== null && getRChildValue(state.geometries, sphere.sortIndex)?.value;

                        // Get the position of the right child
                        const rChildPos = getRChildValue(cdnOfNodes, sphere.sortIndex);

                        return (
                            sphere.value && (
                                <React.Fragment key={'sphere' + i}>
                                    <BinaryHeapSphere3d
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
                                        fillOpacity={!sphere.disappear && !state.disappearAll ? 1 : 0}
                                        color='black'
                                    >
                                        {i}
                                    </Text>
                                </React.Fragment>
                            )
                        )
                    })}
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'flex' : 'none' }}
                    onSliderChange={handleSliderChange}
                    radioGroup={[1, 0, 0]}
                    onRender={handleRender}
                    addConfig={{
                        hasIndex: false,
                        hasValue: true,
                        radioName: 'Add',
                        valueRange: config.geoValueRange
                    }}
                    onAdd={handleAddEle}
                    spinning={state.loading}
                    operation={
                        <div className='btn-group'>
                            <div className='row'>
                                <Button icon={<BarChartOutlined />} onClick={handleRandom}>Generate Random</Button>

                            </div>
                        </div>
                    }

                    displayer={
                        <Steps direction="vertical" size="small" current={state.opeDetails.length - 1}>
                            {state.opeDetails.map((item, i) => {
                                const { type, payload } = item;
                                switch (type) {
                                    case OpeDetailTypes.Add: {
                                        const { value, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Add Node:  v=${value}`}
                                                description={`Current Full Binary Tree: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    case OpeDetailTypes.Swap: {
                                        const { indexes, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Swap Nodes:  i=${indexes[0]}, v=${state.values[indexes[0]]} | i=${indexes[1]}, v=${state.values[indexes[1]]}`}
                                                description={`Current Full Binary Tree: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    default:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Current Binary Heap: ${payload}`}
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
                        Generate Random
                    </Item>
                </Console>

            </div>
        </div>
    )
}

export default BinaryHeap;