import { categories } from "../data/categories"
import { useState, ChangeEvent, FormEvent, Dispatch, useEffect} from "react"
import { Activity } from "../types"
import { ActivityActions, ActivityState } from "../reducers/activity-reducer"
import {v4 as uuidv4} from "uuid"

type FormProps = {
    dispatch: Dispatch<ActivityActions>,
    state: ActivityState
}

const initialState: Activity = {
    id: uuidv4(),
    category: 1,
    name: '',
    calories: ''
}

export default function Form({dispatch, state}: FormProps) {
    const [activity, setActivity] = useState<Activity>(initialState)

    useEffect(() => {
        if(state.activeId){
            const selectedActivity = state.activities.filter(stateActivity => stateActivity.id === state.activeId)[0]
            setActivity(selectedActivity)
        }
    }, [state.activeId])
    

    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const isNumberField = ['category'].includes(e.target.id)

        setActivity({
            ...activity,
            [e.target.id]: isNumberField ? +e.target.value : e.target.value
        })
    }

    const isValidActivity = () =>{
        const{name, calories} = activity
        return name.trim() !== '' && +calories > 0
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        
        dispatch({type: 'save-activity', payload: {newActivity: activity}})

        setActivity({
            ...initialState,
            id: uuidv4()
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow p-10 rounded-lg">
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="category">Categoria: </label>
                <select
                    id="category"
                    className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                    value={activity.category}
                    onChange={handleChange}
                >
                    {
                        categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))
                    }
                </select>
            </div>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="name" className="font-bold">Actividad: </label>
                <input
                    type="text"
                    id="name"
                    className=" border border-slate-300 p-2 rounded-lg"
                    placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
                    value={activity.name}
                    onChange={handleChange}
                />
            </div>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories" className="font-bold">Calorias: </label>
                <input
                    type="text"
                    id="calories"
                    className=" border border-slate-300 p-2 rounded-lg"
                    placeholder="Calorias. ej. 300 o 500"
                    value={activity.calories}
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                className=" bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
                value={activity.category === 1 ? "Guardar Comida" : "Guardar Ejercicio"}
                disabled={!isValidActivity()}
            />
        </form>
    )
}
