import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function CourseCard({id , description ,thumbnailUrl, title}:{id:string , description:string ,thumbnailUrl:string, title:string}) {
  return (
    <div>

        <Card key={id} className="group overflow-hidden flex flex-col transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl border-slate-200 dark:border-slate-800">
                        <div className="relative aspect-video w-full overflow-hidden">
                            <div className="absolute inset-0 z-10 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                            <Image
                                src={thumbnailUrl || "/imgs/course.png"}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <CardHeader className="flex-1">
                            <CardTitle className="text-xl font-bold line-clamp-2 leading-tight">{title}</CardTitle>
                            <CardDescription className="line-clamp-3 mt-2 text-sm">{description}</CardDescription>
                        </CardHeader>
                        
                        <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button className="w-full bg-primary hover:bg-primary/90 text-white dark:text-black transition-colors" asChild>
                                <Link href={`/courses/${id}`} className="flex items-center justify-center gap-2">
                                    View Course
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

    </div>
  )
}
