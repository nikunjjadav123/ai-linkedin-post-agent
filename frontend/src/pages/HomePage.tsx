import { useState } from 'react';
import { Bot, Sparkles, CheckCircle, Send, RefreshCw, PenTool } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { generateHooks, findBestHook, generatePost, evaluatePost, generateHashtags, publishPost } from '../services/api';

export default function HomePage() {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('');
  
  const [hooks, setHooks] = useState<any[]>([]);
  const [selectedHook, setSelectedHook] = useState('');
  const [bestHook, setBestHook] = useState('');
  
  const [postDraft, setPostDraft] = useState('');
  const [postFeedback, setPostFeedback] = useState('');
  const [postScore, setPostScore] = useState<number>(0);
  
  const [hashtags, setHashtags] = useState<string[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);

  const handleGenerateHooks = async () => {
    if (!topic) return;
    setIsProcessing(true);
    try {
      const generatedHooks = await generateHooks(topic);
      setHooks(generatedHooks);
      setStep(2);
    } catch (error) {
      console.error('Failed to generate hooks', error);
      alert('Failed to generate hooks. See console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFindBestHook = async () => {
    if (hooks.length === 0) return;
    setIsProcessing(true);
    try {
      const best = await findBestHook(hooks);
      setBestHook(best.hook);
      setSelectedHook(best.hook);
    } catch (error) {
      console.error('Failed to find best hook', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGeneratePost = async () => {
    if (!selectedHook) return;
    setIsProcessing(true);
    try {
      const result = await generatePost(selectedHook);
      setPostDraft(result.linkedin_post);
      setPostScore(result.score || 0);
      setPostFeedback(result.feedback || '');
      setStep(3);
    } catch (error) {
      console.error('Failed to generate post', error);
      alert('Failed to generate post.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEvaluatePost = async () => {
    if (!postDraft) return;
    setIsProcessing(true);
    try {
      const result = await evaluatePost(postDraft);
      setPostDraft(result.linkedin_post);
      setPostScore(result.score || 0);
      setPostFeedback(result.feedback || '');
    } catch (error) {
      console.error('Failed to evaluate post', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateHashtags = async () => {
    if (!postDraft) return;
    setIsProcessing(true);
    try {
      const generatedHashtags = await generateHashtags(postDraft);
      setHashtags(generatedHashtags);
      setStep(4);
    } catch (error) {
      console.error('Failed to generate hashtags', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (!postDraft) return;
    setIsProcessing(true);
    try {
      const result = await publishPost(postDraft, hashtags);
      setPublishResult(result);
      setStep(5);
    } catch (error) {
      console.error('Failed to publish post', error);
      alert('Failed to publish post. Check console.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary-600" />
            Agentic LinkedIn Creator
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Create high-converting LinkedIn posts with a Human-In-The-Loop AI workflow.
          </p>
        </div>

        {/* Workflow Steps Indicator */}
        <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 translate-y-[-50%] px-10"></div>
          {[
            { num: 1, label: 'Topic' },
            { num: 2, label: 'Hooks' },
            { num: 3, label: 'Draft Post' },
            { num: 4, label: 'Hashtags' },
            { num: 5, label: 'Publish' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center bg-white px-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= s.num ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
              </div>
              <span className={`mt-2 text-xs font-medium ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <Card className="shadow-lg border-0 ring-1 ring-slate-200/50">
          
          {/* STEP 1: TOPIC */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-primary-500" />
                  What do you want to write about?
                </CardTitle>
                <CardDescription>
                  Enter a topic, idea, or rough draft to start the generation process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The importance of Human-in-the-Loop in AI systems..."
                  className="text-lg py-6"
                  autoFocus
                />
              </CardContent>
              <CardFooter className="flex justify-end border-t border-slate-100 pt-6">
                <Button 
                  onClick={handleGenerateHooks} 
                  disabled={!topic || isProcessing}
                  isLoading={isProcessing}
                  size="lg"
                >
                  Generate Hooks <RefreshCw className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </>
          )}

          {/* STEP 2: HOOKS */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary-500" />
                  Select the best Hook
                </CardTitle>
                <CardDescription>
                  Choose a hook generated by the AI or let the AI find the best one for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-2">
                  <span className="font-medium text-slate-700">Generated Hooks ({hooks.length})</span>
                  <Button variant="outline" size="sm" onClick={handleFindBestHook} isLoading={isProcessing}>
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-500" /> 
                    Auto-select Best Hook
                  </Button>
                </div>
                
                <div className="grid gap-3">
                  {hooks.map((h, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedHook(h.hook)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedHook === h.hook 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-slate-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-slate-800 font-medium leading-snug">{h.hook}</p>
                        <Badge variant="default">Score: {h.score}</Badge>
                      </div>
                      {bestHook === h.hook && (
                        <Badge variant="success" className="mt-3">✨ AI Recommended</Badge>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Or edit selected hook manually:</label>
                  <Textarea 
                    value={selectedHook}
                    onChange={(e) => setSelectedHook(e.target.value)}
                    className="font-medium"
                    rows={2}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                <Button variant="ghost" onClick={() => setStep(1)} disabled={isProcessing}>
                  Back
                </Button>
                <Button 
                  onClick={handleGeneratePost} 
                  disabled={!selectedHook || isProcessing}
                  isLoading={isProcessing}
                >
                  Generate Draft Post
                </Button>
              </CardFooter>
            </>
          )}

          {/* STEP 3: POST GENERATION & EVALUATION */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl flex justify-between items-center">
                  <span>Review your Post Draft</span>
                  <Badge variant={postScore >= 8 ? 'success' : postScore >= 5 ? 'warning' : 'error'}>
                    Score: {postScore}/10
                  </Badge>
                </CardTitle>
                <CardDescription>
                  You can edit the post manually right here, or ask the AI to evaluate and improve it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {postFeedback && (
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4 text-sm border border-blue-100">
                    <span className="font-bold flex items-center"><Bot className="w-4 h-4 mr-1" /> AI Feedback:</span>
                    <p className="mt-1">{postFeedback}</p>
                  </div>
                )}

                <Textarea 
                  value={postDraft}
                  onChange={(e) => setPostDraft(e.target.value)}
                  className="min-h-[300px] leading-relaxed resize-y"
                />
                
                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleEvaluatePost} isLoading={isProcessing}>
                    <Sparkles className="w-4 h-4 mr-2" /> Improve this Post
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                <Button variant="ghost" onClick={() => setStep(2)} disabled={isProcessing}>
                  Back to Hooks
                </Button>
                <Button 
                  onClick={handleGenerateHashtags} 
                  disabled={!postDraft || isProcessing}
                  isLoading={isProcessing}
                >
                  Next: Generate Hashtags
                </Button>
              </CardFooter>
            </>
          )}

          {/* STEP 4: HASHTAGS & FINAL REVIEW */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Final Touches</CardTitle>
                <CardDescription>
                  Review your hashtags and the final composition before publishing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Generated Hashtags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hashtags.map((tag, idx) => (
                      <Badge key={idx} variant="default" className="text-sm py-1 cursor-pointer hover:bg-slate-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Input 
                    value={hashtags.join(' ')} 
                    onChange={(e) => setHashtags(e.target.value.split(' ').filter(Boolean))} 
                    placeholder="#AI #Content #LinkedIn" 
                  />
                  <p className="text-xs text-slate-500 mt-2">Space-separated list of hashtags.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-3 border-b pb-2">Final Post Preview</h4>
                  <p className="whitespace-pre-wrap text-slate-800 text-sm">{postDraft}</p>
                  <p className="mt-4 text-primary-600 font-medium text-sm">{hashtags.join(' ')}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                <Button variant="ghost" onClick={() => setStep(3)} disabled={isProcessing}>
                  Back to Draft
                </Button>
                <Button 
                  onClick={handlePublish} 
                  disabled={isProcessing}
                  isLoading={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" /> Publish to LinkedIn
                </Button>
              </CardFooter>
            </>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && publishResult && (
            <CardContent className="pt-10 pb-10 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Successfully Published!</h2>
              <p className="text-slate-600 mb-2">{publishResult.message}</p>
              {publishResult.linkedin_post_id && (
                <p className="font-mono bg-slate-100 inline-block px-3 py-1 rounded text-sm text-slate-700 mt-4">
                  ID: {publishResult.linkedin_post_id}
                </p>
              )}
              
              <div className="mt-10">
                <Button onClick={() => {
                  setStep(1);
                  setTopic('');
                  setHooks([]);
                  setPostDraft('');
                  setHashtags([]);
                  setPublishResult(null);
                }}>
                  Create Another Post
                </Button>
              </div>
            </CardContent>
          )}

        </Card>
      </div>
    </div>
  );
}
