import React, { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, PageHeader, Steps, message } from 'antd';
import { Text } from '@react-three/drei';
import Console, { Item } from '../../components/Console/console';
import Scene3d from '../../components/Scene3d/scene3d';
import QueueCube3d from './QueueCube3d/queueCube3d'
import { IReducer, OpeDetailTypes } from '../../types';
import {
    BarChartOutlined,
    DotChartOutlined
} from '@ant-design/icons';
import { dequeueSeq, enqueueSeq, getStartPosX, initCubes, initSeq } from './utils';
import { initState, IState, reducer } from './store';
import config from './config'
import { root } from '../../configs/router/config';
import { excuteSeq, randomArr, randomNum } from '../../utils';

const { Step } = Steps;

const Queue = () => {

    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
            cubes: initCubes(state.values),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: initState.values }]
        }
    });

    /** Whether the scene is loaded */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** Calculate the starting x-coordinate of the first element based on the array length */
    const startPosX = getStartPosX(state.cubes.length);

    /** Handle the scene loaded callback */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** Handle random elements */
    const handleRandom = () => {
        let sequence = initSeq(randomArr(randomNum(config.geoNumRange), config.geoValueRange));
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** Handle enqueue */
    const handleEnqueue = (index: number, value: number) => {
        if (state.values.length < config.geoNumRange[1] + 5) {
            const sequence = enqueueSeq(value, state.values.length);
            excuteSeq(sequence, config.animationSpeed, dispatch);

        } else {
            message.warning(`Failed to enqueue, the maximum capacity of the queue is ${config.geoNumRange[1] + 5}`)
        }
    }

    /** Handle dequeue */
    const handleDequeue = () => {
        if (state.values.length > 0) {
            const sequence = dequeueSeq();
            excuteSeq(sequence, config.animationSpeed, dispatch);

        } else {
            message.warning('Failed to dequeue, the queue is currently empty')
        }

    }
    return (
        <div className='queue-warp'>
            <PageHeader
                onBack={() => {
                    history.replace(root)
                    window.location.reload();
                }}
                title='Queue'
            />

            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >
                    {state.cubes.map((item, i, arr) => (
                        <React.Fragment key={item.key}>
                            <QueueCube3d
                                value={item.value}
                                position={[startPosX + (i * config.geoBaseDistance), config.geoBasePosY, 0]}
                                isActive={item.isActive}
                                disappear={item.disappear}
                            />
                            {i === 0 || i === arr.length - 1 ?
                                <Text
                                    fillOpacity={!state.disappearAll ? 1 : 0}
                                    color='black'
                                    fontSize={0.5}
                                    position={[startPosX + (i * config.geoBaseDistance), config.geoBasePosY - 1, 0]}
                                >
                                    {i === 0 ? 'head' : 'tail'}
                                </Text> : <></>
                            }
                        </React.Fragment>
                    ))}
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'flex' : 'none' }}
                    radioGroup={[1, 1, 0]}
                    addConfig={{
                        hasIndex: false,
                        hasValue: true,
                        valueRange: config.geoValueRange,
                        radioName: 'Enqueue'
                    }}
                    deleteConfig={{
                        hasIndex: false,
                        hasValue: false,
                        radioName: 'Dequeue'
                    }}
                    showSilider={false}
                    onAdd={handleEnqueue}
                    onDelete={handleDequeue}
                    spinning={state.loading}
                    operation={
                        <div className='btn-group'>
                            <div className='row'>
                                <Button icon={<BarChartOutlined />} onClick={handleRandom}>Random Generate</Button>
                            </div>
                        </div>
                    }

                    displayer={
                        <Steps direction="vertical" size="small" current={state.opeDetails.length - 1}>
                            {state.opeDetails.map((item, i) => {
                                const { type, payload } = item;
                                switch (type) {
                                    case OpeDetailTypes.Enqueue:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Enqueue: v=${payload.enqueueValue}`}
                                                description={`Current queue: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    case OpeDetailTypes.Dequeue:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Dequeue: v=${payload.dequeueValue}`}
                                                description={`Current queue: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    default:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Current queue: [${payload.toString()}]`}
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

                </Console>
            </div>

        </div>
    )
}

export default Queue;