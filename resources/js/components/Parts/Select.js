import React from "react";


export default function UniSelect (props){

    return(
        <select name="" id="">
            <option value="">select your university</option>
            {props.data.map ( (uni, i) =>
                    <option key={i} value={uni.id} >{uni.uni_name}/({uni.uni_short_name})</option>)}
        </select>
    );
}
