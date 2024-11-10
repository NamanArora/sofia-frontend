import React, { useState } from 'react';
import { AlertCircle, ClipboardCopy, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { star } from '../../api';

const STARFramework = ({ className }) => {
  const [inputs, setInputs] = useState({
    cvPoint: '',
    context: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (field) => (e) => {
    setInputs(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await star({ cvPoint: inputs.cvPoint, context: inputs.context });
      setResult(response);
    } catch (err) {
      setError('Failed to process STAR framework conversion');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get color for missing element pills
  const getPillColor = (element) => {
    const colors = {
      situation: 'bg-blue-100 text-blue-800',
      task: 'bg-green-100 text-green-800',
      action: 'bg-yellow-100 text-yellow-800',
      result: 'bg-red-100 text-red-800',
      all: 'bg-gray-100 text-gray-800'
    };
    return colors[element] || colors.all;
  };

  return (
    <div className={className || ''}>
      <Card className="border-t-4 border-t-purple-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">STAR Framework Generator</CardTitle>
          <CardDescription>
            Transform your CV points into the STAR format automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* CV Point Input */}
            <div className="space-y-2">
              <Label htmlFor="cvPoint" className="text-base font-semibold">
                CV Point
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Your current CV point)
                </span>
              </Label>
              <Textarea
                id="cvPoint"
                placeholder="Paste your existing CV point here..."
                className="h-24 resize-none"
                value={inputs.cvPoint}
                onChange={handleInputChange('cvPoint')}
                required
              />
            </div>

            {/* Additional Context */}
            <div className="space-y-2">
              <Label htmlFor="context" className="text-base font-semibold">
                Additional Context
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Any additional details that could help in conversion)
                </span>
              </Label>
              <Textarea
                id="context"
                placeholder="Provide more context about the experience, numbers, impact, etc..."
                className="h-32 resize-none"
                value={inputs.context}
                onChange={handleInputChange('context')}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting to STAR Format...
                </>
              ) : (
                'Convert to STAR Format'
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>

          {/* Results Section */}
          {result && (
            <div className="space-y-4 pt-4 border-t">
              {/* STAR Format Status */}
              {result.followsStar ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Good job! Your CV point is already in prescribed format</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Missing STAR Elements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingElements.map((element) => (
                      <span
                        key={element}
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getPillColor(element)}`}
                      >
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Transformed Result */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">STAR Format Result</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(result.transformedPoint)}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <Card className="bg-purple-50/50">
                  <CardContent className="pt-6">
                    <p className="text-sm leading-relaxed">
                      {result.transformedPoint}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* STAR Framework Information */}
          <div className="pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">About the STAR Framework</h3>
            <div className="prose text-gray-600 space-y-4">
              <p>
                The STAR framework is a structured method for presenting professional experiences effectively.
                It helps transform regular CV points into compelling stories that showcase your impact and abilities.
              </p>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card className="bg-purple-50/30">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-purple-700">Components of STAR</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="list-disc pl-4 space-y-2">
                      <li><span className="font-semibold">Situation:</span> The context or background of the experience</li>
                      <li><span className="font-semibold">Task:</span> The specific challenge or responsibility you faced</li>
                      <li><span className="font-semibold">Action:</span> The steps you took to address the task</li>
                      <li><span className="font-semibold">Result:</span> The outcomes and impact of your actions</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50/30">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-purple-700">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Provides clear structure to your experiences</li>
                      <li>Highlights your specific contributions</li>
                      <li>Quantifies impact where possible</li>
                      <li>Makes achievements more memorable</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <p className="text-sm text-gray-500 italic mt-4">
                Pro Tip: Always try to include specific metrics and numbers in your results when possible.
                This helps demonstrate the tangible impact of your work.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { STARFramework };