import {Image} from "react-bootstrap";

export const TrashTypeImage = (
    {size, fontSize, type}: {size: string, fontSize: string, type: string}) => {
    return (
        <Image width={size} height={size} style={{fontSize: fontSize}}
                   src={"/types/" + type + ".svg"} alt={"🗑️"}/>
    )
}
