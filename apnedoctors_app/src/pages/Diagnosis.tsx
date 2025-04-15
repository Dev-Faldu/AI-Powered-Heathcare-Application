import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdvancedSymptomChecker from '@/components/ai/AdvancedSymptomChecker';
import QuizSymptomChecker from '@/components/ai/symptom-checker/QuizSymptomChecker';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  Clock, 
  Shield, 
  FileText, 
  Zap,
  BrainCircuit,
  RefreshCw,
  Settings,
  BookOpen,
  BarChart3,
  MessageSquare,
  ListChecks,
  Video
} from 'lucide-react';
import { DiagnosisResult } from '@/services/DiagnosisService';
import { MedicalModel } from '@/types/medical';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Diagnosis = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'form'>('chat');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>(['transformer-med-v1', 'gpt-med-v2']);
  
  const aiModels: MedicalModel[] = [
    { id: 'transformer-med-v1', name: 'Medical Transformer', accuracy: 0.92, type: 'transformer' },
    { id: 'gpt-med-v2', name: 'GPT Medical', accuracy: 0.89, type: 'llm' },
    { id: 'bert-symptoms-v1', name: 'BERT Symptom Analyzer', accuracy: 0.87, type: 'bert' },
    { id: 'med-decision-tree-v1', name: 'Medical Decision Tree', accuracy: 0.85, type: 'decision-tree' },
  ];
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDiagnosisComplete = (result: DiagnosisResult) => {
    setDiagnosisResult(result);
  };

  const startVideoConsultation = () => {
    navigate('/video-consultation');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground dotCount={4} />
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block rounded-full bg-medical-100 dark:bg-medical-900/30 px-4 py-1.5 mb-4 animate-fade-in">
                <span className="text-medical-700 dark:text-medical-400 text-sm font-medium">
                  AI-Powered Healthcare
                </span>
              </span>
              <h1 className="font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
                Advanced <span className="gradient-text">AI Diagnosis</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in">
                Get an instant assessment of your symptoms using our state-of-the-art deep learning models
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
                <a
                  href="https://aryan-pawar-apnedoctorsmedicalchatbot-btwig4srrhjru6b6bcqbdr.streamlit.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "px-6 py-2 rounded-full flex items-center justify-center transition-all duration-300",
                    activeTab === 'chat'
                      ? "bg-gradient-to-r from-medical-500 to-teal-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  AI Chat
                </a>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={cn(
                    "px-6 py-2 rounded-full flex items-center justify-center transition-all duration-300",
                    activeTab === 'quiz'
                      ? "bg-gradient-to-r from-medical-500 to-teal-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  <ListChecks className="mr-2 h-4 w-4" />
                  Symptom Quiz
                </button>
                <button
                  onClick={() => setActiveTab('form')}
                  className={cn(
                    "px-6 py-2 rounded-full flex items-center justify-center transition-all duration-300",
                    activeTab === 'form'
                      ? "bg-gradient-to-r from-medical-500 to-teal-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Form Input
                </button>
                <Button 
                  variant="outline"
                  className="px-6 py-2 rounded-full flex items-center justify-center transition-all duration-300 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-800 hover:bg-teal-200 dark:hover:bg-teal-800/50"
                  onClick={startVideoConsultation}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Video Consult
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 animate-fade-in">
                {activeTab === 'chat' ? (
                  <AdvancedSymptomChecker 
                    className="h-[650px]" 
                    onDiagnosisComplete={handleDiagnosisComplete}
                  />
                ) : activeTab === 'quiz' ? (
                  <QuizSymptomChecker
                    className="h-[650px]"
                    onDiagnosisComplete={handleDiagnosisComplete}
                  />
                ) : (
                  <div className="glass-card h-[650px] p-6 overflow-y-auto">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Symptom Assessment Form</h3>
                    
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          What symptoms are you experiencing?
                        </label>
                        <textarea 
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-medical-500"
                          rows={4}
                          placeholder="Describe your symptoms in detail..."
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          How long have you been experiencing these symptoms?
                        </label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-medical-500">
                          <option value="">Select duration</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rate the severity of your symptoms (1-10)
                        </label>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-medical-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>Mild</span>
                          <span>Moderate</span>
                          <span>Severe</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Do you have any pre-existing medical conditions?
                        </label>
                        <div className="space-y-2">
                          {['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Cancer', 'None'].map(condition => (
                            <label key={condition} className="flex items-center">
                              <input type="checkbox" className="rounded text-medical-500 focus:ring-medical-500 mr-2" />
                              <span className="text-gray-700 dark:text-gray-300">{condition}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Select AI Models to Use
                        </label>
                        <div className="space-y-2">
                          {aiModels.map(model => (
                            <label key={model.id} className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="rounded text-medical-500 focus:ring-medical-500 mr-2"
                                checked={selectedModels.includes(model.id)}
                                onChange={() => {
                                  if (selectedModels.includes(model.id)) {
                                    setSelectedModels(selectedModels.filter(id => id !== model.id));
                                  } else {
                                    setSelectedModels([...selectedModels, model.id]);
                                  }
                                }}
                              />
                              <span className="text-gray-700 dark:text-gray-300">
                                {model.name} <span className="text-xs text-gray-500">({Math.round(model.accuracy * 100)}% accuracy)</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        type="button"
                        className="glass-button w-full flex items-center justify-center"
                      >
                        Start Assessment <ChevronRight className="ml-2 h-5 w-5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
              
              <div className="animate-fade-in md:animate-slide-in-right">
                <Tabs defaultValue="how-it-works" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="how-it-works">
                      <Zap className="h-4 w-4 mr-2" /> How It Works
                    </TabsTrigger>
                    <TabsTrigger value="models">
                      <BrainCircuit className="h-4 w-4 mr-2" /> AI Models
                    </TabsTrigger>
                    <TabsTrigger value="notes">
                      <Shield className="h-4 w-4 mr-2" /> Notes
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="how-it-works" className="mt-4">
                    <div className="glass-card p-6 mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">How It Works</h3>
                      <ul className="space-y-4">
                        {[
                          {
                            icon: <Zap className="h-5 w-5 text-medical-500" />,
                            title: "Describe Symptoms",
                            text: "Tell us what you're experiencing in your own words or via voice input."
                          },
                          {
                            icon: <BrainCircuit className="h-5 w-5 text-medical-500" />,
                            title: "AI Analysis",
                            text: "Our transformer-based models analyze your symptoms using medical knowledge graphs."
                          },
                          {
                            icon: <BarChart3 className="h-5 w-5 text-teal-500" />,
                            title: "Get Assessment",
                            text: "Receive a detailed report with probability-based condition predictions."
                          },
                          {
                            icon: <RefreshCw className="h-5 w-5 text-teal-500" />,
                            title: "Follow Up",
                            text: "Connect with specialists for confirmation and treatment."
                          }
                        ].map((step, index) => (
                          <li key={index} className="flex">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center mr-3">
                              {step.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{step.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{step.text}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="models" className="mt-4">
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Our AI Models</h3>
                      <div className="space-y-4">
                        {aiModels.map((model) => (
                          <div key={model.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gray-900 dark:text-white">{model.name}</h4>
                              <span className="text-xs px-2 py-1 bg-medical-100 dark:bg-medical-900/30 text-medical-800 dark:text-medical-200 rounded-full">
                                {model.type.toUpperCase()}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                                <div 
                                  className="bg-medical-500 h-1.5 rounded-full" 
                                  style={{ width: `${model.accuracy * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px]">
                                {Math.round(model.accuracy * 100)}%
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {model.type === 'transformer' && "Specialized in complex symptom relationships and medical contexts"}
                              {model.type === 'llm' && "Trained on extensive medical literature and clinical guidelines"}
                              {model.type === 'bert' && "Optimized for understanding medical terminology and symptom descriptions"}
                              {model.type === 'decision-tree' && "Excellent for clear diagnostic pathways based on symptom patterns"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-4">
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Important Notes</h3>
                      <ul className="space-y-3">
                        {[
                          {
                            icon: <Shield className="h-5 w-5 text-teal-500" />,
                            text: "Your information is secure and HIPAA compliant with AES-256 encryption."
                          },
                          {
                            icon: <Clock className="h-5 w-5 text-medical-500" />,
                            text: "For medical emergencies, call emergency services immediately."
                          },
                          {
                            icon: <BookOpen className="h-5 w-5 text-medical-500" />,
                            text: "This system is intended to supplement, not replace, professional medical advice."
                          },
                          {
                            icon: <Settings className="h-5 w-5 text-teal-500" />,
                            text: "All predictions include confidence scores to indicate reliability."
                          }
                        ].map((note, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 mt-0.5">
                              {note.icon}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{note.text}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {diagnosisResult && (
                  <div className="glass-card p-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Analysis Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Confidence Score:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.round(diagnosisResult.confidenceScore * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Top Condition:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {diagnosisResult.conditions[0]?.name || "None"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Specialist Needed:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {diagnosisResult.conditions[0]?.specialistType || "None"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Urgency Level:</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          diagnosisResult.conditions[0]?.urgency === 'high' 
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : diagnosisResult.conditions[0]?.urgency === 'medium'
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        )}>
                          {diagnosisResult.conditions[0]?.urgency.toUpperCase() || "None"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        className="w-full bg-teal-500 hover:bg-teal-600"
                        onClick={startVideoConsultation}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Consult With Doctor Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Diagnosis;
