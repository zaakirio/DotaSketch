import React from 'react';
import { Card } from '@material-ui/core';
import Timer from '../Timer/Timer';
import Word from '../Word/Word';
import Score from '../Score/Score';
import "./GameBar.css";

const GameBar: React.FC = () => {
    return (
        <Card id="gameBar">
            <div id="objectsContainer">
                <Timer />
                <Word />
                <Score />
            </div>
        </Card>
    )
}

export default GameBar