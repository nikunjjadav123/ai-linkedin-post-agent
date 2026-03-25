import { useState, useEffect } from 'react';
import { Bot, Sparkles, CheckCircle, Send, PenTool, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { getAuthUrl, runWorkflow, resumeWorkflow, type WorkflowResponse } from '../services/api';

export default function HomePage() {
  const [step, setStep] = useState(1);
  const [threadId, setThreadId] = useState<string | null>(null);
  
  const [topic, setTopic] = useState('');
  const [hooks, setHooks] = useState<any[]>([]);
  const [selectedHook, setSelectedHook] = useState('');
  const [bestHook, setBestHook] = useState('');
  
  const [postDraft, setPostDraft] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('linkedin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    setIsAuthLoading(true);
    try {
      const { url } = await getAuthUrl();
      window.location.href = url;
    } catch (err) {
      console.error("Failed to fetch auth URL", err);
      alert("Failed to initiate LinkedIn Login");
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('linkedin_token');
    localStorage.removeItem('linkedin_person_id');
    setIsAuthenticated(false);
  };

  const handleStateResponse = (response: WorkflowResponse) => {
    setThreadId(response.thread_id);
    const state = response.state;
    
    if (response.next_node.includes('Generate LinkedIn Post Based on Best Hook')) {
      // Breakpoint 1: After Hooks are generated
      setHooks(state.hooks || []);
      setBestHook(state.the_best_hook || '');
      setSelectedHook(state.the_best_hook || '');
      setStep(2);
    } 
    else if (response.next_node.includes('Post LinkedIn After Approve')) {
      // Breakpoint 2: Before publishing
      setPostDraft(state.linkedin_post || '');
      setHashtags(state.hashtags || []);
      setStep(3);
    }
    else if (response.is_finished) {
      // End of workflow
      setPublishResult(state);
      setStep(4);
    }
  };

  const validateTopic = (val: string) => {
    if (val.trim().length < 3) {
      return 'Topic must be at least 3 characters long.';
    }
    const words = val.trim().split(/\s+/).filter(Boolean);
    if (words.length < 3) {
      return 'Please enter a more descriptive topic (at least 3 words).';
    }
    return null;
  };

  const handleStartWorkflow = async () => {
    const error = validateTopic(topic);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setIsProcessing(true);
    try {
      const response = await runWorkflow(topic);
      handleStateResponse(response);
    } catch (error: any) {
      console.error('Failed to start workflow', error);
      const backendMsg = error.response?.data?.detail?.[0]?.msg || 'Failed to start workflow.';
      alert(`Error: ${backendMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResumeWithHook = async () => {
    if (!selectedHook || !threadId) return;
    setIsProcessing(true);
    try {
      const response = await resumeWorkflow(threadId, { the_best_hook: selectedHook });
      handleStateResponse(response);
    } catch (error) {
      console.error('Failed to resume with hook', error);
      alert('Failed to generate post. Check backend terminal.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (!postDraft || !threadId) return;
    setIsProcessing(true);
    try {
      const response = await resumeWorkflow(threadId, { 
        linkedin_post: postDraft, 
        hashtags: hashtags 
      });
      handleStateResponse(response);
    } catch (error) {
      console.error('Failed to publish post', error);
      alert('Failed to publish post. Check backend terminal.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        {isAuthenticated && (
          <div className="absolute top-0 right-0">
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors">
              Logout
            </Button>
          </div>
        )}
        <div className="text-center mb-10 pt-4">
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary-600" />
            Stateful Agentic LinkedIn Creator
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Powered by LangGraph Human-In-The-Loop Checkpointing.
          </p>
          {threadId && (
            <p className="mt-2 text-xs font-mono text-slate-400">Thread ID: {threadId}</p>
          )}
        </div>

        {/* Workflow Steps Indicator */}
        <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 translate-y-[-50%] px-10"></div>
          {[
            { num: 1, label: 'Topic' },
            { num: 2, label: 'Review Hook' },
            { num: 3, label: 'Review Post' },
            { num: 4, label: 'Publish' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center bg-white px-4">
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

        {!isAuthenticated ? (
          <Card className="shadow-lg border-0 ring-1 ring-slate-200/50 text-center py-12">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <LogIn className="w-8 h-8" />
                </div>
              </div>
              <CardTitle className="text-2xl">Connect Your Account</CardTitle>
              <CardDescription>
                Authenticate with LinkedIn to empower the agent to publish directly to your individual profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-6">
              <Button onClick={handleLogin} isLoading={isAuthLoading} size="lg" className="bg-[#0A66C2] hover:bg-[#004182]">
                Login with LinkedIn
              </Button>
            </CardContent>
          </Card>
        ) : (
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
                  Enter a topic to start the LangGraph workflow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. The importance of Checkpointing in LangGraph..."
                  className={`text-lg py-6 ${validationError ? 'border-red-500 ring-red-200' : ''}`}
                  autoFocus
                />
                {validationError && (
                  <p className="mt-2 text-sm text-red-500 font-medium">{validationError}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end border-t border-slate-100 pt-6">
                <Button 
                  onClick={handleStartWorkflow} 
                  disabled={!topic || isProcessing}
                  isLoading={isProcessing}
                  size="lg"
                >
                  Start Workflow
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
                  Review Hooks
                </CardTitle>
                <CardDescription>
                  The graph is paused! Review and select the best hook before generating the final post.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  Cancel
                </Button>
                <Button 
                  onClick={handleResumeWithHook} 
                  disabled={!selectedHook || isProcessing}
                  isLoading={isProcessing}
                >
                  Confirm & Resume Graph
                </Button>
              </CardFooter>
            </>
          )}

          {/* STEP 3: POST GENERATION & EVALUATION */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Final Review</CardTitle>
                <CardDescription>
                  The graph evaluated your post and generated hashtags. It is now paused before publishing. Make any final edits!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Draft Post</label>
                  <Textarea 
                    value={postDraft}
                    onChange={(e) => setPostDraft(e.target.value)}
                    className="min-h-[300px] leading-relaxed resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hashtags</label>
                  <Input 
                    value={hashtags.join(' ')} 
                    onChange={(e) => setHashtags(e.target.value.split(' ').filter(Boolean))} 
                  />
                </div>

              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                <Button variant="ghost" onClick={() => setStep(2)} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePublish} 
                  disabled={isProcessing}
                  isLoading={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" /> Approve & Publish
                </Button>
              </CardFooter>
            </>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && publishResult && (
            <CardContent className="pt-10 pb-10 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Workflow Completed!</h2>
              <p className="text-slate-600 mb-2">{publishResult.message}</p>
              {publishResult.linkedin_post_id && (
                <p className="font-mono bg-slate-100 inline-block px-3 py-1 rounded text-sm text-slate-700 mt-4">
                  LinkedIn Post ID: {publishResult.linkedin_post_id}
                </p>
              )}
              
              <div className="mt-10">
                <Button onClick={() => {
                  setStep(1);
                  setThreadId(null);
                  setTopic('');
                  setHooks([]);
                  setPostDraft('');
                  setHashtags([]);
                  setPublishResult(null);
                }}>
                  Start New Workflow
                </Button>
              </div>
            </CardContent>
          )}

        </Card>
        )}
      </div>
    </div>
  );
}
