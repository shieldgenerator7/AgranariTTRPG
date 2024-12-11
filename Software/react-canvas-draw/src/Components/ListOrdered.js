"use strict";

import { Component } from "react";

/**
     * 
     * @param {*} arr 
     * @param {*} contentFunc 
     * @param {*} updateFunc
     * @param {*} allowReordering
     * @param {*} allowCopying
     * @param {*} allowDeletion
     */
class ListOrdered extends Component {
    /**
     * 
     * @param {*} arr 
     * @param {*} contentFunc 
     * @param {*} updateFunc
     * @param {*} allowReordering
     * @param {*} allowCopying
     * @param {*} allowDeletion
     */
    constructor(props) {
        super(props);//arr, contentFunc, updateFunc, allowReordering, allowCopying, allowDeletion
        //2024-09-24: copied from https://www.geeksforgeeks.org/drag-and-drop-sortable-list-using-reactjs/
        this.state = {
            draggingItem: null,
            newItemName: '',
            newItemImage: '',
        };
    }
    //2024-09-24: the following handle...() methods copied from https://www.geeksforgeeks.org/drag-and-drop-sortable-list-using-reactjs/
    handleDragStart = (e, item) => {
        this.setState({ draggingItem: item });
        e.dataTransfer.setData('text/plain', '');
    };

    handleDragEnd = () => {
        this.setState({ draggingItem: null });
    };

    handleDragOver = (e) => {
        e.preventDefault();
    };

    handleDrop = (e, targetItem) => {
        const { draggingItem } = this.state;
        const { arr } = this.props;
        if (!draggingItem) return;

        const currentIndex = arr.indexOf(draggingItem);
        const targetIndex = arr.indexOf(targetItem);

        if (currentIndex !== -1 && targetIndex !== -1) {
            arr.splice(currentIndex, 1);
            arr.splice(targetIndex, 0, draggingItem);
        }
    };
    render() {
        let arr = this.props.arr;
        let contentFunc = this.props.contentFunc;
        let updateFunc = this.props.updateFunc;
        let allowReordering = this.props.allowReordering ?? true;
        let allowCopying = this.props.allowCopying ?? true;
        let allowDeletion = this.props.allowDeletion ?? true;
        return (
            <div>
                {arr.map((obj, i) => (
                    <div
                        key={`listordered_${i}`}
                        className="listordereditem"
                        draggable={allowReordering}
                        onDragStart={(e) => this.handleDragStart(e, obj)}
                        onDragEnd={this.handleDragEnd}
                        onDragOver={this.handleDragOver}
                        onDrop={(e) => this.handleDrop(e, obj)}
                    >
                        {allowReordering &&
                        <div className="listordereddraghandle">
                            &#8801;
                        </div>
                        }
                        {contentFunc(
                            obj,
                            i
                        )}
                        {/* Copy button */}
                        {allowCopying &&
                        <button className="listorderedbutton" onClick={() => {
                            let json = JSON.stringify(obj);
                            navigator.clipboard.writeText(json);
                        }}>
                            &#10697;</button>
                        }
                        {/* Remove button */}
                        {allowDeletion &&
                        <button className="listorderedbuttonX" onClick={() => {
                            arr.splice(i, 1);
                            updateFunc(arr);
                        }}>X</button>
                        }
                        {/* <RiDragMove2Line/> */}
                    </div>
                ))}
            </div>
        );
    }
}
export default ListOrdered;
