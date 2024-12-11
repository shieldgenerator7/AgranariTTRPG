"use strict";

import Dropzone from "react-dropzone";
import { costDisplay, costSpec } from "../Data/CostSpec";
import Creature, { backwardsCompatifyCreature, inflateCreature } from "../Data/Creature";
import { downloadFile } from "../Utility/Download";
import { UploadFile, UploadFromFilePicker } from "../Utility/Upload";
import { arraySort, arraySum, clamp } from "../Utility/Utility";

function CardListPanel({ cardList, setCardList, currentCard, setCard, updateCard, setPasteString }) {
    return (
        <div className="leftPanel">
            {/* Deck Stats */}
            <div className="listInfo">
                <p> Creature List</p>
                <p> Count: {cardList.length}</p>
                <p> Total Cost: ({arraySum(cardList, card => costSpec.getTotalCost(card) * card.count)}/100pts)</p>
                <p> Sort:
                    <select onChange={(e) => {
                        let value = e.target.value;
                        let mf = (a) => a;//"map func"
                        let mfname = (a) => a.getNameText(true, false) || "[creature]";
                        let mfcost = (a) => costSpec.getTotalCost(a);
                        let mfstars = (a) => costSpec.getStarCount(a);
                        let mfpowerbase = (a) => a.basePower;
                        let mfcount = (a) => a.count;
                        let mfdatecreation = (a) => a.creationDate;
                        switch (value) {
                            case "name": mf = mfname; break;
                            case "cost": mf = mfcost; break;
                            case "stars": mf = mfstars; break;
                            case "power_base": mf = mfpowerbase; break;
                            case "count": mf = mfcount; break;
                            case "date_creation": mf = mfdatecreation; break;
                        }
                        let reverseList = [
                            "count",
                            "date_creation",
                        ];
                        arraySort(cardList, mf, !reverseList.includes(value));
                        setCardList([...cardList]);
                    }}>
                        <option value="name">Species & Name</option>
                        <option value="cost">Cost</option>
                        <option value="stars">Stars</option>
                        <option value="power_base">Base Power</option>
                        <option value="count">Count</option>
                        <option value="date_creation">Creation Date</option>
                    </select>
                </p>
            </div>
            {/* Deck Stats (Behind) */}
            <div className="listInfoFiller">
            </div>
            {/* Card List */}
            <div className="list">
                {
                    cardList.map((card, i) => {
                        let cardName = card.getNameText(true, false) || "[creature]";
                        let className = "listItem" + ((card == currentCard) ? " select" : "");
                        let countClassName = (card == currentCard) ? "select" : "";
                        return (
                            <div key={`divCard${i}`}
                                className={className} onClick={() => setCard(card)}
                            >
                                <span>{cardName} {costDisplay(costSpec.getTotalCost(card), false, true, false)}</span>
                                <button className={countClassName}
                                    onClick={e => {
                                        card.count++;
                                        updateCard(card);
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onContextMenu={e => {
                                        card.count = Math.max(0, card.count - 1);
                                        updateCard(card);
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                >x{card.count}</button>
                            </div>
                        );
                    })
                }
                <div key="divCardNew">
                    <button className="action listAction" onClick={() => {
                        let newcard = new Creature();
                        setCard(newcard);
                        cardList.push(newcard);
                        setCardList([...cardList]);
                    }}>
                        Add New Card
                    </button>
                </div>
                <div>
                    <button className="action listAction" onClick={() => {
                        UploadFromFilePicker(".card", true, (json) => {
                            let card = JSON.parse(decodeURIComponent(json));
                            inflateCreature(card);
                            backwardsCompatifyCreature(card);
                            cardList.push(card);
                            setCardList([...cardList]);
                            setCard(card);
                        });
                    }}>Upload .card File</button>
                </div>
                <div>
                    <button className="action listAction" onClick={() => {
                        cardList.forEach(card => {
                            let cardName = `${card.getNameText(false, true, costSpec) || "card"}`.trim().replaceAll(" ", "");
                            downloadFile(card, cardName, "card");
                        });
                    }}>Download All Cards</button>
                </div>
                {currentCard.count == 0 &&
                    <button className="action listAction danger" onClick={() => {
                        let index = cardList.indexOf(currentCard);
                        cardList.splice(index, 1);
                        index = clamp(index, 0, cardList.length - 1);
                        currentCard = cardList[index];
                        setCardList([...cardList]);
                        setCard(currentCard);
                    }}>
                        Delete Card
                    </button>
                }

                {/* Drop Zone */}
                <Dropzone
                    onDrop={
                        files => files.forEach(file =>
                            UploadFile(
                                file,
                                true,
                                (json) => {
                                    let card = JSON.parse(decodeURIComponent(json));
                                    inflateCreature(card);
                                    backwardsCompatifyCreature(card);
                                    cardList.push(card);
                                    setCardList([...cardList]);
                                    setCard(card);
                                }
                            ))
                    }
                >
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: "lowvisibilitylabel" })}>
                            <input {...getInputProps()} />
                            <p>Drop .card files here</p>
                        </div>
                    )}
                </Dropzone>


                {/* Paste Box */}
                {/* <div className='lowvisibilitylabel'>Paste Box</div>
                <textarea className="field multiline lowvisibility" onChange={(e) => {
                    //2024-03-03: setup to work with a specific Excel spreadsheet i have
                    let txt = e.target.value;
                    if (!txt) { return; }
                    setPasteString(txt);
                }}
                    rows="2"
                    placeholder="Paste here from spreadsheet"
                    value={""}
                ></textarea> */}
            </div>
        </div>
    );
}

export default CardListPanel;
