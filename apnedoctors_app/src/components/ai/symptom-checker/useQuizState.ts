
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DiagnosisResult, Symptom, diagnosisService } from '@/services/DiagnosisService';
import { QuizQuestion, AnalysisDetails, MedicalAIModel } from './types';

export const useQuizState = (
  onDiagnosisComplete?: (result: DiagnosisResult) => void
) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['transformer-med-v1', 'gpt-med-v2']);
  const [currentQuizPath, setCurrentQuizPath] = useState<string[]>([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [analysisDetails, setAnalysisDetails] = useState<AnalysisDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'quiz' | 'analysis'>('quiz');

  // Expanded AI models available
  const aiModels: MedicalAIModel[] = [
    { id: 'transformer-med-v1', name: 'Medical Transformer', accuracy: 0.92, type: 'transformer', specialization: 'General medical diagnosis' },
    { id: 'gpt-med-v2', name: 'GPT Medical', accuracy: 0.89, type: 'llm', specialization: 'Rare diseases and complex presentations' },
    { id: 'bert-symptoms-v1', name: 'BERT Symptom Analyzer', accuracy: 0.87, type: 'bert', specialization: 'Symptom pattern recognition' },
    { id: 'med-decision-tree-v1', name: 'Medical Decision Tree', accuracy: 0.85, type: 'decision-tree', specialization: 'Clear clinical pathways' },
    { id: 'biobert-v2', name: 'BioBERT Clinical', accuracy: 0.91, type: 'bert', specialization: 'Biomedical domain expertise' },
    { id: 'symptom-graph-nn', name: 'Symptom Graph Neural Network', accuracy: 0.88, type: 'graph-nn', specialization: 'Symptom relationships and clusters' },
  ];

  // Enhanced question set with branching logic
  const initialQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What is your primary concern today?',
      type: 'multiple-choice',
      options: [
        { id: 'q1_pain', text: 'Pain or discomfort', value: 'pain', nextQuestionId: 'q2' },
        { id: 'q1_respiratory', text: 'Respiratory issues', value: 'respiratory', nextQuestionId: 'q4' },
        { id: 'q1_digestive', text: 'Digestive problems', value: 'digestive', nextQuestionId: 'q7' },
        { id: 'q1_neurological', text: 'Neurological symptoms', value: 'neurological', nextQuestionId: 'q8' },
        { id: 'q1_general', text: 'General feeling unwell', value: 'general', nextQuestionId: 'q3' }
      ],
      aiModelId: 'symptom-graph-nn',
      medicalContext: 'Initial symptom categorization is critical for appropriate branching logic and model selection.'
    },
    {
      id: 'q2',
      question: 'Where is the pain or discomfort located?',
      type: 'multiple-choice',
      options: [
        { 
          id: 'q2_head', 
          text: 'Head', 
          value: 'head',
          relatedSymptom: { id: 's1', name: 'Headache', severity: 5 },
          aiModelWeight: 0.8
        },
        { 
          id: 'q2_chest', 
          text: 'Chest', 
          value: 'chest',
          relatedSymptom: { id: 's9', name: 'Chest Pain', severity: 8 },
          aiModelWeight: 0.9
        },
        { 
          id: 'q2_abdomen', 
          text: 'Abdomen', 
          value: 'abdomen',
          relatedSymptom: { id: 's11', name: 'Abdominal Pain', severity: 6 },
          aiModelWeight: 0.75
        },
        { 
          id: 'q2_extremities', 
          text: 'Arms/Legs', 
          value: 'extremities',
          relatedSymptom: { id: 's12', name: 'Extremity Pain', severity: 4 },
          aiModelWeight: 0.6
        },
        { 
          id: 'q2_back', 
          text: 'Back', 
          value: 'back',
          relatedSymptom: { id: 's13', name: 'Back Pain', severity: 5 },
          aiModelWeight: 0.7
        }
      ],
      aiModelId: 'biobert-v2',
      medicalContext: 'Pain location is a primary differentiator for diagnostic pathways.',
      followUp: true,
      requiredForModels: ['transformer-med-v1', 'med-decision-tree-v1']
    },
    {
      id: 'q3',
      question: 'Do you have a fever?',
      type: 'boolean',
      options: [
        { 
          id: 'q3_yes', 
          text: 'Yes', 
          value: 'yes',
          relatedSymptom: { id: 's2', name: 'Fever', severity: 6 },
          aiModelWeight: 0.85
        },
        { id: 'q3_no', text: 'No', value: 'no', aiModelWeight: 0.4 },
        { id: 'q3_unsure', text: 'Unsure', value: 'unsure', aiModelWeight: 0.2 }
      ],
      aiModelId: 'transformer-med-v1',
      medicalContext: 'Fever is a cardinal sign of infection and inflammatory processes.',
      requiredForModels: ['gpt-med-v2', 'bert-symptoms-v1']
    },
    {
      id: 'q4',
      question: 'Which respiratory symptoms are you experiencing?',
      type: 'multiple-choice',
      options: [
        { 
          id: 'q4_cough', 
          text: 'Cough', 
          value: 'cough',
          relatedSymptom: { id: 's3', name: 'Cough', severity: 4 },
          aiModelWeight: 0.7
        },
        { 
          id: 'q4_shortness', 
          text: 'Shortness of Breath', 
          value: 'shortness',
          relatedSymptom: { id: 's6', name: 'Shortness of Breath', severity: 8 },
          aiModelWeight: 0.9
        },
        { 
          id: 'q4_sorethroat', 
          text: 'Sore Throat', 
          value: 'sorethroat',
          relatedSymptom: { id: 's5', name: 'Sore Throat', severity: 3 },
          aiModelWeight: 0.6
        },
        { 
          id: 'q4_stuffynose', 
          text: 'Stuffy or Runny Nose', 
          value: 'stuffy',
          relatedSymptom: { id: 's14', name: 'Nasal Congestion', severity: 2 },
          aiModelWeight: 0.5
        },
        { id: 'q4_none', text: 'None of these', value: 'none', aiModelWeight: 0.1 }
      ],
      aiModelId: 'bert-symptoms-v1',
      medicalContext: 'Respiratory symptom patterns help differentiate between upper and lower respiratory conditions.',
      requiredForModels: ['transformer-med-v1', 'gpt-med-v2']
    },
    {
      id: 'q5',
      question: 'Are you feeling any of these general symptoms?',
      type: 'multiple-choice',
      options: [
        { 
          id: 'q5_fatigue', 
          text: 'Fatigue', 
          value: 'fatigue',
          relatedSymptom: { id: 's4', name: 'Fatigue', severity: 5 },
          aiModelWeight: 0.75
        },
        { 
          id: 'q5_nausea', 
          text: 'Nausea', 
          value: 'nausea',
          relatedSymptom: { id: 's7', name: 'Nausea', severity: 6 },
          aiModelWeight: 0.7
        },
        { 
          id: 'q5_dizziness', 
          text: 'Dizziness', 
          value: 'dizziness',
          relatedSymptom: { id: 's8', name: 'Dizziness', severity: 5 },
          aiModelWeight: 0.8
        },
        { 
          id: 'q5_chills', 
          text: 'Chills', 
          value: 'chills',
          relatedSymptom: { id: 's15', name: 'Chills', severity: 4 },
          aiModelWeight: 0.65
        },
        { id: 'q5_none', text: 'None of these', value: 'none', aiModelWeight: 0.1 }
      ],
      aiModelId: 'transformer-med-v1',
      medicalContext: 'Constitutional symptoms provide context for specific complaints.'
    },
    {
      id: 'q6',
      question: 'How long have you been experiencing these symptoms?',
      type: 'multiple-choice',
      options: [
        { id: 'q6_hours', text: 'Hours', value: 'hours', aiModelWeight: 0.6 },
        { id: 'q6_days', text: 'Days', value: 'days', aiModelWeight: 0.7 },
        { id: 'q6_weeks', text: 'Weeks', value: 'weeks', aiModelWeight: 0.8 },
        { id: 'q6_months', text: 'Months or longer', value: 'months', aiModelWeight: 0.9 }
      ],
      aiModelId: 'med-decision-tree-v1',
      medicalContext: 'Symptom duration significantly affects differential diagnosis prioritization.'
    },
    {
      id: 'q7',
      question: 'Which digestive symptoms are you experiencing?',
      type: 'multiple-choice',
      options: [
        { 
          id: 'q7_nausea', 
          text: 'Nausea/Vomiting', 
          value: 'nausea',
          relatedSymptom: { id: 's7', name: 'Nausea', severity: 6 },
          aiModelWeight: 0.75
        },
        { 
          id: 'q7_diarrhea', 
          text: 'Diarrhea', 
          value: 'diarrhea',
          relatedSymptom: { id: 's16', name: 'Diarrhea', severity: 7 },
          aiModelWeight: 0.8
        },
        { 
          id: 'q7_constipation', 
          text: 'Constipation', 
          value: 'constipation',
          relatedSymptom: { id: 's17', name: 'Constipation', severity: 5 },
          aiModelWeight: 0.7
        },
        { 
          id: 'q7_bloating', 
          text: 'Bloating/Gas', 
          value: 'bloating',
          relatedSymptom: { id: 's18', name: 'Bloating', severity: 4 },
          aiModelWeight: 0.6
        },
        { 
          id: 'q7_bloodystool', 
          text: 'Blood in stool', 
          value: 'bloodystool',
          relatedSymptom: { id: 's19', name: 'Blood in Stool', severity: 9 },
          aiModelWeight: 0.95
        }
      ],
      aiModelId: 'biobert-v2',
      medicalContext: 'Digestive symptom patterns help differentiate between various gastrointestinal conditions.'
    },
    {
      id: 'q8',
      question: 'Which neurological symptoms are you experiencing?',
      type: 'multiple-choice',
      options: [
        { 
          id: 'q8_headache', 
          text: 'Headache', 
          value: 'headache',
          relatedSymptom: { id: 's1', name: 'Headache', severity: 5 },
          aiModelWeight: 0.75
        },
        { 
          id: 'q8_dizziness', 
          text: 'Dizziness/Vertigo', 
          value: 'dizziness',
          relatedSymptom: { id: 's8', name: 'Dizziness', severity: 6 },
          aiModelWeight: 0.8
        },
        { 
          id: 'q8_numbness', 
          text: 'Numbness/Tingling', 
          value: 'numbness',
          relatedSymptom: { id: 's20', name: 'Numbness', severity: 7 },
          aiModelWeight: 0.85
        },
        { 
          id: 'q8_confusion', 
          text: 'Confusion', 
          value: 'confusion',
          relatedSymptom: { id: 's21', name: 'Confusion', severity: 8 },
          aiModelWeight: 0.9
        },
        { 
          id: 'q8_vision', 
          text: 'Vision Changes', 
          value: 'vision',
          relatedSymptom: { id: 's22', name: 'Vision Changes', severity: 7 },
          aiModelWeight: 0.85
        }
      ],
      aiModelId: 'gpt-med-v2',
      medicalContext: 'Neurological symptom patterns are critical for differentiating between various neurological conditions.'
    }
  ];

  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  
  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Handle answer selection with advanced logic
  const handleAnswer = (optionId: string, value: string, relatedSymptom?: Symptom) => {
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
    
    // Add symptom if present
    if (relatedSymptom && value !== 'no' && value !== 'none') {
      if (!selectedSymptoms.some(s => s.id === relatedSymptom.id)) {
        setSelectedSymptoms(prev => [...prev, relatedSymptom]);
      }
    }
    
    // Track quiz path for AI analysis
    setCurrentQuizPath(prev => [...prev, `${currentQuestion.id}:${optionId}`]);
    
    // Determine next question using branching logic
    const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
    
    if (selectedOption?.nextQuestionId) {
      // Find the index of the next question
      const nextIndex = questions.findIndex(q => q.id === selectedOption.nextQuestionId);
      if (nextIndex !== -1) {
        setCurrentQuestionIndex(nextIndex);
        return;
      }
    }
    
    // Default to next sequential question if no branching
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete the quiz
      completeQuiz();
    }
  };
  
  // Go back to previous question with path tracking
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      // Remove last path entry
      setCurrentQuizPath(prev => prev.slice(0, -1));
      
      // Default to previous sequential question
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Complete the quiz and analyze symptoms
  const completeQuiz = () => {
    setQuizComplete(true);
    setActiveTab('analysis');
    runDiagnosisAnalysis();
  };
  
  // Restart the quiz
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedSymptoms([]);
    setAnswers({});
    setDiagnosisResult(null);
    setQuizComplete(false);
    setCurrentQuizPath([]);
    setAnalysisDetails(null);
    setActiveTab('quiz');
  };
  
  // Toggle model selection
  const toggleModelSelection = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  // Run diagnosis analysis with multiple AI models
  const runDiagnosisAnalysis = async () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No symptoms detected",
        description: "Please answer the questions to identify symptoms.",
        variant: "destructive",
      });
      return;
    }
    
    // Start analysis process
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Simulate progressive analysis stages
      const stages = [
        "Initializing AI models...",
        "Processing symptom inputs...",
        "Running transformer neural networks...",
        "Generating medical knowledge graph...",
        "Applying clinical decision rules...",
        "Cross-referencing medical literature...",
        "Calculating condition probabilities...",
        "Finalizing diagnosis recommendations..."
      ];
      
      let stageIndex = 0;
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const newProgress = Math.min(prev + 12, 100);
          
          // Show different stage messages
          if (newProgress > stageIndex * 12 && stageIndex < stages.length) {
            toast({
              title: "Analysis Update",
              description: stages[stageIndex],
            });
            stageIndex++;
          }
          
          if (newProgress >= 100) {
            clearInterval(progressInterval);
          }
          return newProgress;
        });
      }, 600);
      
      // Simulate multi-model analysis with varying weights
      setTimeout(async () => {
        // Generate confidence score based on symptoms and path
        const baseConfidence = 0.65 + (selectedSymptoms.length * 0.05);
        const pathComplexityBonus = currentQuizPath.length * 0.02;
        const symptomSeverityFactor = selectedSymptoms.reduce((acc, s) => acc + (s.severity || 5), 0) / 
                                    (selectedSymptoms.length * 10);
        
        const calculatedConfidence = Math.min(0.98, baseConfidence + pathComplexityBonus + symptomSeverityFactor);
        setConfidenceScore(calculatedConfidence);
        
        // Create mock model contributions data
        const modelContributions = selectedModels.map(modelId => {
          const model = aiModels.find(m => m.id === modelId);
          const modelConfidence = model ? (model.accuracy * 0.9) + (Math.random() * 0.1) : 0.8;
          
          return {
            modelId,
            confidence: modelConfidence,
            conditions: ['Common Cold', 'Seasonal Allergies', 'Influenza'].slice(0, 1 + Math.floor(Math.random() * 3))
          };
        });
        
        setAnalysisDetails({
          modelContributions
        });
        
        const result = await diagnosisService.analyzeSymptoms(selectedSymptoms);
        
        // Enhance the result with our multi-model analysis
        result.confidenceScore = calculatedConfidence;
        
        // Add more detailed condition descriptions based on symptoms
        if (result.conditions.length > 0) {
          result.conditions = result.conditions.map(condition => {
            // Enhance condition with more detailed description
            return {
              ...condition,
              description: condition.description + " This assessment is based on your reported symptoms and our multi-model AI analysis."
            };
          });
          
          // Add more specific follow-up questions
          result.followUpQuestions = [
            ...result.followUpQuestions,
            "Does your pain radiate to other areas?",
            "Do your symptoms worsen with specific activities?",
            "Have you been exposed to anyone with similar symptoms?"
          ];
        }
        
        setDiagnosisResult(result);
        setIsAnalyzing(false);
        setAnalysisProgress(100);
        
        if (onDiagnosisComplete) {
          onDiagnosisComplete(result);
        }
        
        clearInterval(progressInterval);
        
        toast({
          title: "Analysis Complete",
          description: "Our AI models have generated insights based on your symptoms.",
        });
      }, 5000);
    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        title: "Analysis Error",
        description: "An error occurred during symptom analysis. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  // Quiz progress percentage
  const progressPercentage = (currentQuestionIndex / questions.length) * 100;

  return {
    currentQuestionIndex,
    selectedSymptoms,
    answers,
    isAnalyzing,
    analysisProgress,
    diagnosisResult,
    quizComplete,
    selectedModels,
    confidenceScore,
    analysisDetails,
    activeTab,
    aiModels,
    questions,
    currentQuestion,
    progressPercentage,
    handleAnswer,
    handleBack,
    completeQuiz,
    restartQuiz,
    toggleModelSelection,
    setActiveTab,
    runDiagnosisAnalysis
  };
};
