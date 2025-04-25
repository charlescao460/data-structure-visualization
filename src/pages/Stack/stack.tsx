import React, { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, PageHeader, Steps, message } from 'antd';
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons';
import Scene3d from '../../components/Scene3d/scene3d'
import StackCube3d from './StackCube3d/stackCube3d';
import { Text } from '@react-three/drei';
import { IReducer, OpeDetailTypes } from '../../types';
import { getStartYPos, initCubes, initSeq, parseValue, popSeq, pushSeq } from './utils';
import Console, { Item } from '../../components/Console/console';
import { IState, initState, reducer } from './store'
import config from './config'
import { root } from '../../configs/router/config';
import { excuteSeq, randomArr, randomNum } from '../../utils';


const { Step } = Steps;

const Stack = () => {
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
            cubes: initCubes(state.values),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: initState.values }]
        }
    });

    /** Starting coordinate of stackCube */
    const startPosY = getStartYPos(state.cubes.length);

    /** Whether the scene has finished loading */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** Handle scene loaded callback */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** Render array in the renderer */
    const handleRender = (value: string) => {
        const parseRes = parseValue(value);
        if (Array.isArray(parseRes)) {
            let sequence = initSeq(parseRes);
            excuteSeq(sequence, config.animationSpeed, dispatch);
        } else {
            message.warning(parseRes)
        }
    }

    /** Handle pop operation */
    const handlePop = () => {
        if (state.values.length > 0) {
            const sequence = popSeq();
            excuteSeq(sequence, config.animationSpeed, dispatch);
        } else {
            message.warning('Failed to pop, the stack is empty')
        }

    }

    /** Handle push operation */
    const handlePush = (index: number, value: number) => {
        if (state.values.length < config.geoNumRange[1] + 4) {
            const sequence = pushSeq(value);
            excuteSeq(sequence, config.animationSpeed, dispatch);
        } else {
            message.warning(`Failed to push, the maximum capacity of the stack is ${config.geoNumRange[1] + 4}`)
        }

    }

    /** Handle random elements */
    const handleRandom = () => {
        let sequence = initSeq(randomArr(randomNum(config.geoNumRange), config.geoValueRange));
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    return (
        <div className='stack-warp'>
            <PageHeader
                onBack={() => {
                    history.replace(root)
                    window.location.reload();
                }}
                title='Stack'
            />
            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >
                    {state.cubes.map((item, i) => (
                        <React.Fragment key={i + '!'}>
                            <StackCube3d
                                value={item.value}
                                position={[0, startPosY + (i * config.geoBaseDistance) + config.geoBasePosY, 0]}
                                isActive={item.isActive}
                                disappear={item.disappear}

                            />
                            {(i === state.cubes.length - 1 && !state.disappearAll) ?
                                <Text
                                    fontSize={0.5}
                                    color='black'
                                    position={[-2.5, startPosY + (i * config.geoBaseDistance) + config.geoBasePosY, 0]}
                                >
                                    {'Top ——>'}
                                </Text> : <></>}
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
                        radioName: 'Push'
                    }}
                    deleteConfig={{
                        hasIndex: false,
                        hasValue: false,
                        radioName: 'Pop'
                    }}
                    showSilider={false}
                    onAdd={handlePush}
                    onDelete={handlePop}
                    onRender={handleRender}
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
                                    case OpeDetailTypes.Pop:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Pop: v=${payload.popValue}`}
                                                description={`Current stack: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    case OpeDetailTypes.Push:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Push: v=${payload.pushValue}`}
                                                description={`Current stack: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    default:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`Current stack: [${payload.toString()}]`}
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

export default Stack;