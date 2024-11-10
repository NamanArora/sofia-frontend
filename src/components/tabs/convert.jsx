import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, ClipboardCopy, FileText, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { translateSingle, translateBulk } from '../../api';
import { Badge } from '@/components/ui/badge';

const domains = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'product-management', label: 'Product Management' },
  { value: 'finance', label: 'Finance' },
];

const ResultCard = ({ result }) => {
  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Translation Result</CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigator.clipboard.writeText(result.translatedPoint)}
        >
          <ClipboardCopy className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Translated Point:</p>
          <p className="text-sm bg-muted p-3 rounded-md">{result.translatedPoint}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Domain Alignment:</p>
          <div className="flex flex-wrap gap-2">
            {result.domainAlignment.map((item, index) => (
              <Badge key={index} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Preserved Elements:</p>
          <div className="flex flex-wrap gap-2">
            {result.preservedElements.map((item, index) => (
              <Badge key={index} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SingleTranslationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [cvPoint, setCvPoint] = useState('');
  const [domain, setDomain] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await translateSingle({
        cvPoint,
        targetDomain: domain,
        jobDescription: jobDescription || undefined,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cvPoint">CV Point</Label>
        <Textarea
          id="cvPoint"
          value={cvPoint}
          onChange={(e) => setCvPoint(e.target.value)}
          placeholder="Enter your CV point here..."
          className="h-24"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Target Domain</Label>
        <Select 
          value={domain}
          onValueChange={setDomain}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {domains.map((domain) => (
              <SelectItem key={domain.value} value={domain.value}>
                {domain.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description (Optional)</Label>
        <Textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste relevant job description here..."
          className="h-24"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Translating...
          </>
        ) : (
          'Translate'
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && <ResultCard result={result} />}
    </form>
  );
};

const BulkTranslationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [cvPoints, setCvPoints] = useState('');
  const [domain, setDomain] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const pointsArray = cvPoints
        .split('\n')
        .map(point => point.trim())
        .filter(point => point.length > 0);

      const response = await translateBulk({
        cvPoints: pointsArray,
        targetDomain: domain,
        jobDescription: jobDescription || undefined,
      });

      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Create CSV content with all details
    const csvRows = [
      ['Original', 'Translated', 'Domain Alignment', 'Preserved Elements']
    ];

    results.forEach(result => {
      csvRows.push([
        result.original,
        result.translated,
        result.domainAlignment.join('; '),
        result.preservedElements.join('; ')
      ]);
    });

    const csv = csvRows
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cvPoints">CV Points</Label>
        <Textarea
          id="cvPoints"
          value={cvPoints}
          onChange={(e) => setCvPoints(e.target.value)}
          placeholder="Enter multiple CV points (one per line)..."
          className="h-48"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bulkDomain">Target Domain</Label>
        <Select
          value={domain}
          onValueChange={setDomain}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {domains.map((domain) => (
              <SelectItem key={domain.value} value={domain.value}>
                {domain.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bulkJobDescription">Job Description (Optional)</Label>
        <Textarea
          id="bulkJobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste relevant job description here..."
          className="h-24"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing {results.length} points...
          </>
        ) : (
          'Translate All'
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Results</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
            >
              <FileText className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-2 gap-4 p-4">
                <div className="font-medium">Original</div>
                <div className="font-medium">Translated</div>
              </div>
              {results.map((result, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 border-t p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedResult(selectedResult === result ? null : result)}
                >
                  <div className="text-sm">{result.original}</div>
                  <div className="space-y-2">
                    <div className="text-sm">{result.translated}</div>
                    {selectedResult === result && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Domain Alignment:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.domainAlignment.map((item, i) => (
                              <Badge key={i} variant="secondary">{item}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Preserved Elements:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.preservedElements.map((item, i) => (
                              <Badge key={i} variant="outline">{item}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
};

const CVPointConverter = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl">
        <Card className="border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle>Sofia v1</CardTitle>
            <CardDescription>
              Transform your sustainability experience for different domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="single" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single">Single Translation</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Translation</TabsTrigger>
              </TabsList>
              <TabsContent value="single">
                <SingleTranslationForm />
              </TabsContent>
              <TabsContent value="bulk">
                <BulkTranslationForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export  {CVPointConverter};