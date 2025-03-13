import {FormEvent} from "react";


export default function NewEventForm({visible}: {visible: boolean}) {

    function onFormSubmit(e: FormEvent) {
        e.preventDefault();
    }

    return (
        <div className={`m-4 p-2 border-2 border-gray-950 rounded ${visible ? '' : 'hidden'}`}>
            <p>Stofna viðburð</p>
            <form className={'flex flex-col'} onSubmit={onFormSubmit}>
                <label htmlFor="title-inp">Nafn viðburðs</label>
                <input type="text" id={'title-inp'} required/>

                <label htmlFor="desc-inp">Lýsing</label>
                <input type="text" id={'desc-inp'} required/>

                <label htmlFor="startdate-inp">Byrjar</label>
                <input type="datetime-local" id={'startdate-inp'} required/>


                <label htmlFor="enddate-inp">Endar</label>
                <input type="datetime-local" id={'enddate-inp'} required/>

                <input className={'mt-4'} type="submit" value="Stofna viðburð"/>
            </form>
        </div>
    )
}