import { ILessons } from '@/lib/models'

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import Link from 'next/link';

import React, { useEffect, useState } from 'react'

import { DeleteIcon, Edit, Save, TrashIcon } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';

import { Label } from '@/components/ui/label';


export default function LessonCard({ id, title, durationSeconds, overview, category, isPublished }: ILessons) {
    
    const [values,setValues] = useState<ILessons|null>({
        id,
        category,
        durationSeconds,
        isPublished,
        overview,
        title
    })
    if (values===null){
        console.log("Null")
    }
    const deleteCard = async ()=>{
        const url = process.env.NEXT_PUBLIC_BACKEND_SERVER || "http://localhost:5000"
        const response = await fetch(`${url}/api/api/courses/:courseId/lessons/${id}`,{
            credentials:"include",
            method:"DELETE"
        })
        if (!response.ok){
            throw new Error
        }
        const Card = await response.json()
        setValues(null)
    }
    return (
        <div><Card key={id} className="border-slate-200 shadow-sm bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="bg-slate-100/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-xl font-bold text-slate-900">{title}</CardTitle>
                <CardDescription className="text-slate-500">
                    {overview}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4">
                    <p className="text-slate-500 text-sm">
                        Duration: {durationSeconds} seconds
                    </p>
                </div>
                <div className="p-4">
                    <p className="text-slate-500 text-sm">
                        Category: {category}
                    </p>
                </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-3.5'>
                <div className="options flex justify-between items-center gap-4">
                    <div className="opt1 flex justify-between items-center gap-1">

                        <Checkbox id='Is-Featured' value={values?.isPublished} onChange={(e)=>setValues((pre)=>(
                            {...pre,isPublished:e.currentTarget.value}
                            ))} />
                        <Label htmlFor='Is-Featured'>
                            isPublished
                        </Label>
                    </div>
                </div>
                <div className="logos flex items-center justify-between gap-3">
                    <Button variant={"outline"}>
                        Edit <Edit />
                    </Button>
                    <Button variant={"destructive"} onClick={deleteCard}>
                        Delete
                        <TrashIcon />
                    </Button>
                    <Button>
                        Save
                        <Save />
                    </Button>
                </div>

            </CardFooter>
        </Card>
        </div>
    )
}
