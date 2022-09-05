import React, { useState, useEffect } from 'react';
import useStore from '../../state/Store';
import { Grid } from '@material-ui/core';
import './AvatarSelector.css';


const avatarList = [    
    "avatar_1.png",
    "avatar_2.png",
    "avatar_3.png",
    "avatar_4.png",
    "avatar_5.png",
    "avatar_6.png"
];

const AvatarSelector: React.FC = () => {
    const { selectedAvatar, setAvatar } = useStore(state => ({
        selectedAvatar: state.avatar,
        setAvatar: state.setAvatar
    }))

    return (
        <>
            <h1 id="avatarsTitle">Choose an Avatar !</h1>
            <Grid container justify="center">
                {avatarList.map((avatar, index) => {
                    const isSelected = (selectedAvatar === index)
                    return (
                        <Grid item md={2} sm={4} xs={6} onClick={() => setAvatar(index)}>

                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}

export default AvatarSelector