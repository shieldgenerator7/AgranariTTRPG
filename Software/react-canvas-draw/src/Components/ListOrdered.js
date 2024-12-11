"use strict";

import { Component } from "react";

/**
     * 
     * @param {*} arr 
     * @param {*} contentFunc 
     * @param {*} updateFunc 
     */
class ListOrdered extends Component {
    /**
     * 
     * @param {*} arr 
     * @param {*} contentFunc 
     * @param {*} updateFunc 
     */
    constructor(props) {
        super(props);//arr, contentFunc, updateFunc
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
        return (
            <div>
                {arr.map((obj, i) => (
                    <div
                        key={`listordered_${i}`}
                        className="listordereditem"
                        draggable="true"
                        onDragStart={(e) => this.handleDragStart(e, obj)}
                        onDragEnd={this.handleDragEnd}
                        onDragOver={this.handleDragOver}
                        onDrop={(e) => this.handleDrop(e, obj)}
                    >
                        <div className="listordereddraghandle">
                            &#8801;
                        </div>
                        {contentFunc(
                            obj,
                            i
                        )}
                        {/* Copy button */}
                        <button className="listorderedbutton" onClick={() => {
                            let json = JSON.stringify(obj);
                            navigator.clipboard.writeText(json);
                        }}>
                            &#10697;</button>
                        {/* Remove button */}
                        <button className="listorderedbuttonX" onClick={() => {
                            arr.splice(i, 1);
                            updateFunc(arr);
                        }}>X</button>
                        {/* <RiDragMove2Line/> */}
                    </div>
                ))}
            </div>
        );
    }
}
export default ListOrdered;
