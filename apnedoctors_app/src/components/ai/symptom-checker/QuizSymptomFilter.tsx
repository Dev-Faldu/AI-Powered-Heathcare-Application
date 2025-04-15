
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Symptom } from "@/services/DiagnosisService";

interface QuizSymptomFilterProps {
  selectedSymptoms: Symptom[];
}

const QuizSymptomFilter = ({ selectedSymptoms }: QuizSymptomFilterProps) => {
  if (selectedSymptoms.length === 0) {
    return null;
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Symptoms: {selectedSymptoms.length}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <h4 className="font-medium text-sm mb-2">Identified Symptoms</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {selectedSymptoms.map(symptom => (
            <div key={symptom.id} className="flex justify-between items-center text-sm">
              <span>{symptom.name}</span>
              {symptom.severity && (
                <Badge variant="outline">Severity: {symptom.severity}/10</Badge>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuizSymptomFilter;
