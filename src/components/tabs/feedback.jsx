import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { MessageSquarePlus, Loader2, CheckCircle2 } from 'lucide-react';

const FeedbackButton = () => {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim()) return;

        setIsSubmitting(true);

        try {
            // Netlify Forms submission
            const formData = new FormData();
            formData.append('form-name', 'feedback');
            formData.append('feedback', feedback);

            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
            });

            setIsSuccess(true);
            setFeedback('');

            // Close modal after showing success for 1.5 seconds
            setTimeout(() => {
                setIsOpen(false);
                setIsSuccess(false);
            }, 1500);

        } catch (error) {
            console.error('Failed to submit feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Hidden Netlify Form */}
            <form
                name="feedback"
                data-netlify="true"
                hidden
            >
                <input type="hidden" name="form-name" value="feedback" />
                <textarea name="feedback" />
            </form>

            {/* Feedback Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="default"
                        size="lg"
                        className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 gap-2"
                    >
                        <MessageSquarePlus className="h-5 w-5" />
                        Feedback
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Send us your feedback</DialogTitle>
                        <DialogDescription>
                            We'd love to hear your thoughts! Your feedback helps us improve our service.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                        {!isSuccess ? (
                            <>
                                <Textarea
                                    placeholder="What's on your mind?"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="min-h-[120px]"
                                    disabled={isSubmitting}
                                />
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !feedback.trim()}
                                    className="self-end"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Feedback'
                                    )}
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2 py-4">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                                <p className="text-center font-medium">Thanks for your feedback!</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export { FeedbackButton };