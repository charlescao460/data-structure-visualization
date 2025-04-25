import React, { useEffect, useRef, useState } from "react";
import { Menu, InputNumber, Button, Drawer, Slider, Radio, Divider, Spin, Input } from "antd";
import { LoadingOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { randomNum, useHover } from "../../utils";
import { IBaseProps, Range } from "../../types";
import { animated, config, useSpring } from "@react-spring/web";
import './console.scss'

const { Item, SubMenu } = Menu;

interface radioConfig {
    /** Whether to have an index input box */
    hasIndex?: boolean;
    /** Whether to have a value input box */
    hasValue?: boolean;
    /** Index range */
    indexRange?: Range;
    /** Value range */
    valueRange?: Range;
    /** radioName corresponding to buttonName */
    radioName?: string;
}

interface IConsoleProps extends IBaseProps {
    /** Indicates whether to add, delete, search */
    radioGroup: [0 | 1, 0 | 1, 0 | 1];
    /** Operation interface on the left side of the console */
    operation: React.ReactNode;
    /** Display on the right side of the console */
    displayer: React.ReactNode;
    /** Height of the drawer */
    drawerHeight?: number;
    /** Whether to show the slider */
    showSilider?: boolean;
    /** Configuration for the add element input box */
    addConfig?: radioConfig;
    /** Configuration for the delete element input box */
    deleteConfig?: radioConfig;
    /** Configuration for the search element input box */
    searchConfig?: radioConfig;
    /** Whether the operation is being executed */
    spinning?: boolean;
    /** Callback when the slider changes */
    onSliderChange?: (value: number) => void;
    /** Callback when the add button is clicked */
    onAdd?: (value: number, index: number) => void;
    /** Callback when the delete button is clicked */
    onDelete?: (value: number, index: number) => void;
    /** Callback when the search button is clicked */
    onSearch?: (value: number, index: number) => void;
    /** Callback when the renderer input box changes */
    onRenderChange?: (value: string) => void;
    /** Callback when the render button is clicked */
    onRender?: (value: string) => void;
}

const Console: React.FC<IConsoleProps> = (props) => {

    const {
        children,
        style,
        operation,
        displayer,
        drawerHeight,
        showSilider,
        radioGroup,
        addConfig,
        deleteConfig,
        searchConfig,
        spinning,
        onSliderChange,
        onAdd,
        onDelete,
        onSearch,
        onRenderChange,
        onRender,
    } = props;

    const [hoverLeftRef, isLeftHover] = useHover();
    const [hoverRenderRef, isRenderHover] = useHover();

    const [isUnfold, setIsUnfold] = useState(true);

    const [addValue, setAddValue] = useState(randomNum(addConfig?.valueRange || [3, 37]));
    const [addIndex, setAddIndex] = useState(randomNum(addConfig?.indexRange || [0, 3]));

    const [deleteValue, setDeleteValue] = useState(randomNum(deleteConfig?.valueRange || [3, 37]));
    const [deleteIndex, setDeleteIndex] = useState(randomNum(deleteConfig?.indexRange || [0, 3]));

    const [searchValue, setSearchValue] = useState(randomNum(searchConfig?.valueRange || [3, 37]));
    const [searchIndex, setSearchIndex] = useState(randomNum(searchConfig?.indexRange || [0, 3]));

    const [renderValue, setRenderValue] = useState('');

    // Active radio
    const [radioActived, setRadioActived] = useState(0);

    const displayConRef = useRef<HTMLDivElement>();
    const { leftOpacity, renderOpacity } = useSpring({
        leftOpacity: isLeftHover ? 0.7 : 0.2,
        renderOpacity: isRenderHover ? 0.7 : 0.2,
        config: config.gentle
    })

    /** Keep the scrollbar at the bottom when the content in the displayer increases */
    useEffect(() => {
        if (displayConRef.current) displayConRef.current.scrollTop = displayConRef.current.scrollHeight;
    }, [displayConRef.current?.scrollHeight])

    const getDefaultRadio = (radioGroup: any[]) => {
        for (let i = 0; i <= radioGroup.length - 1; i++) {
            if (radioGroup[i] === 1) {
                return i;
            }
        }
    }

    /** Check if the number of 1s in radioGroup is 1 */
    const isRadioOneNum = (radioGroup: any[]) => {
        let num = 0;
        if (radioGroup[0] === 1) num++;
        if (radioGroup[1] === 1) num++;
        if (radioGroup[2] === 1) num++

        if (num === 1) return true;
        return false;
    }

    return (
        <>
            <animated.div
                className='console-left'
                ref={hoverLeftRef as any}
                style={{ ...style, opacity: leftOpacity }}
            >
                {/* Left sidebar */}
                <Menu
                    className='console'
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={true}
                    selectable={false}
                    style={{ display: isUnfold ? 'none' : 'inline-block' }}
                >
                    <Item
                        icon={<MenuUnfoldOutlined />}
                        key='item0'
                        onClick={() => {
                            setIsUnfold(true);
                        }}
                    >
                        Expand Console
                </Item>
                    {children}
                </Menu>

                {/* Drawer */}
                <Drawer
                    className='console-drawer'
                    title='Console'
                    height={drawerHeight}
                    visible={isUnfold}
                    placement='bottom'
                    mask={false}
                    onClose={() => { setIsUnfold(false) }}
                >

                    <div className='operation'>
                        {showSilider &&
                            <div className='slider-warp'>
                                Animation Speed:
                            <Slider
                                    className='slider'
                                    defaultValue={80}
                                    min={40}
                                    onChange={(value: number) => onSliderChange?.(value)}
                                />
                            </div>
                        }


                        <Spin
                            tip='Operation in progress...'
                            spinning={spinning}
                            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
                        >
                            <div className='operation-main'>
                                {/* Display operation buttons */}
                                {operation}

                                {/* Display add and delete */}
                                <div className='input-group'>
                                    {
                                        !(isRadioOneNum(radioGroup)) ?
                                        <Radio.Group
                                            className='radio-group'
                                            defaultValue={getDefaultRadio(radioGroup)}
                                            onChange={(e) => setRadioActived(e.target.value)}
                                        >

                                            {
                                                radioGroup.map((value, i) => {
                                                    if (value === 1 && i === 0) return <Radio key={i} value={i}>{addConfig?.radioName}</Radio>
                                                    else if (value === 1 && i === 1) return <Radio key={i} value={i}>{deleteConfig?.radioName}</Radio>
                                                    else if (value === 1 && i === 2) return <Radio key={i} value={i}>{searchConfig?.radioName}</Radio>
                                                    else return <></>
                                                })
                                            }
                                        </Radio.Group>
                                        : <div className='radio-empty'></div>
                                    }

                                    <div className='label-group'>
                                        {
                                            radioActived === 0 ?
                                                <>
                                                    {
                                                        addConfig?.hasIndex &&
                                                        (<label>
                                                            <span className='label-name'>Index:</span>
                                                            <InputNumber
                                                                min={(addConfig?.indexRange as unknown as number[])[0]}
                                                                max={(addConfig?.indexRange as unknown as number[])[1]}
                                                                value={addIndex}
                                                                onChange={(index) => {
                                                                    setAddIndex(index)
                                                                }}
                                                            />
                                                        </label>)
                                                    }
                                                    {
                                                        addConfig?.hasValue &&
                                                        (<label>
                                                            <span className='label-name'>Value:</span>
                                                            <InputNumber
                                                                min={(addConfig?.valueRange as unknown as number[])[0]}
                                                                max={(addConfig?.valueRange as unknown as number[])[1]}
                                                                value={addValue}
                                                                onChange={(value) => {
                                                                    setAddValue(value)
                                                                }}
                                                            />
                                                        </label>)
                                                    }
                                                    <Button type='primary' onClick={() => onAdd?.(addIndex, addValue)}>{addConfig?.radioName}</Button>
                                                </> :
                                                radioActived === 1 ?
                                                    <>
                                                        {
                                                            deleteConfig?.hasIndex &&
                                                            (<label>
                                                                <span className='label-name'>Index:</span>
                                                                <InputNumber
                                                                    min={(deleteConfig?.indexRange as unknown as number[])[0]}
                                                                    max={(deleteConfig?.indexRange as unknown as number[])[1]}
                                                                    value={deleteIndex}
                                                                    onChange={(index) => {
                                                                        setDeleteIndex(index);
                                                                    }}
                                                                />
                                                            </label>)
                                                        }
                                                        {
                                                            deleteConfig?.hasValue &&
                                                            (<label>
                                                                <span className='label-name'>Value:</span>
                                                                <InputNumber
                                                                    min={(deleteConfig?.valueRange as unknown as number[])[0]}
                                                                    max={(deleteConfig?.valueRange as unknown as number[])[1]}
                                                                    value={deleteValue}
                                                                    onChange={(value) => {
                                                                        setDeleteValue(value)
                                                                    }}
                                                                />
                                                            </label>)
                                                        }
                                                        <Button type='primary' onClick={() => onDelete?.(deleteIndex, deleteValue)}>{deleteConfig?.radioName}</Button>
                                                    </> :
                                                    <>
                                                        {
                                                            searchConfig?.hasIndex &&
                                                            (<label>
                                                                <span className='label-name'>Index:</span>
                                                                <InputNumber
                                                                    min={(searchConfig?.indexRange as unknown as number[])[0]}
                                                                    max={(searchConfig?.indexRange as unknown as number[])[1]}
                                                                    value={searchIndex}
                                                                    onChange={(index) => {
                                                                        setSearchIndex(index);
                                                                    }}
                                                                />
                                                            </label>)
                                                        }
                                                        {
                                                            searchConfig?.hasValue &&
                                                            (<label>
                                                                <span className='label-name'>Value:</span>
                                                                <InputNumber
                                                                    min={(searchConfig.valueRange as unknown as number[])?.[0]}
                                                                    max={(searchConfig.valueRange as unknown as number[])?.[1]}
                                                                    value={searchValue}
                                                                    onChange={(value) => {
                                                                        setSearchValue(value);
                                                                    }}
                                                                />
                                                            </label>)
                                                        }
                                                        <Button type='primary' onClick={() => onSearch?.(searchIndex, searchValue)}>{searchConfig?.radioName}</Button>
                                                    </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Spin>

                    </div>

                    <Divider
                        className='divider'
                        type='vertical'
                    />

                    <div className='displayer'>
                        <div className='content' ref={displayConRef as any}>
                            {displayer}
                        </div>
                    </div>
                </Drawer>
            </animated.div>
            <animated.div
                className='console-render'
                ref={hoverRenderRef as any}
                style={{ ...style, opacity: renderOpacity }}
            >
                <Input
                    bordered={false}
                    onChange={(e) => {
                        setRenderValue(e.target.value.trim());
                        onRenderChange?.(e.target.value.trim());
                    }}
                />
                <Button type='primary' onClick={() => { onRender?.(renderValue) }}>Render</Button>
            </animated.div>
        </>
    )
}

Console.defaultProps = {
    showSilider: true,
    radioGroup: [1, 1, 1],
    addConfig: {
        hasIndex: true,
        hasValue: true,
        indexRange: [0, 10],
        valueRange: [3, 37],
        radioName: 'Add'
    },
    deleteConfig: {
        hasIndex: true,
        hasValue: true,
        indexRange: [0, 10],
        valueRange: [3, 37],
        radioName: 'Delete'
    },
    searchConfig: {
        hasIndex: true,
        hasValue: true,
        indexRange: [0, 10],
        valueRange: [3, 37],
        radioName: 'Search'
    },
    spinning: false
}

export { Item, SubMenu };
export default Console;
