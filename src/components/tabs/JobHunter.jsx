import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const JobHunter = ({ className }) => (
    <div className={className}>
        <Card>
            <CardHeader>
                <CardTitle>JD Compatibility Checker</CardTitle>
                <CardDescription>
                    Find out how relevant your CV is for a given job description. 
                </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <h3 className="text-2xl font-semibold text-muted-foreground">Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                        Arre bhai thoda toh time do new features banane ke liye :o 
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
);

export { JobHunter }