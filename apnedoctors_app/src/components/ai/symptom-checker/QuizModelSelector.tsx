
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MedicalAIModel } from "./types";

interface QuizModelSelectorProps {
  selectedModels: string[];
  aiModels: MedicalAIModel[];
  onModelSelectionChange: (modelId: string) => void;
}

const QuizModelSelector = ({
  selectedModels,
  aiModels,
  onModelSelectionChange
}: QuizModelSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <BrainCircuit className="mr-2 h-4 w-4" />
          AI Models ({selectedModels.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Select AI Models to Use</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            These models will analyze your symptoms using different approaches.
          </p>
          <div className="space-y-2 mt-2">
            {aiModels.map(model => (
              <label key={model.id} className="flex items-start">
                <input 
                  type="checkbox" 
                  className="rounded text-medical-500 focus:ring-medical-500 mr-2 mt-1"
                  checked={selectedModels.includes(model.id)}
                  onChange={() => onModelSelectionChange(model.id)}
                />
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {model.name} 
                    <span className="ml-1 text-xs text-gray-500">({Math.round(model.accuracy * 100)}%)</span>
                  </div>
                  <div className="text-xs text-gray-500">{model.specialization}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuizModelSelector;
