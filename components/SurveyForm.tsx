import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useStores } from '@/store/MobxContext';
import { observer } from 'mobx-react-lite';

const SurveyForm = observer(() => {
  const { surveyFormStore } = useStores();
  const { surveyFormValues, errors, addQuestion, removeQuestion, addOption, removeOption, submitSurvey } = surveyFormStore;

  return (
    <ScrollView style={styles.container}>
      {/* Survey Title */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Survey Title</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., Customer Feedback Survey"
          value={surveyFormValues.surveyTitle}
          onChangeText={(text) => surveyFormStore.updateFormValues({ surveyTitle: text })}
        />
        {errors.surveyTitle && <Text style={styles.errorText}>{errors.surveyTitle}</Text>}
      </View>

      {/* Questions */}
      {surveyFormValues.questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.label}>Question {index + 1}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your question (e.g., What is your name?)"
            value={question.question}
            onChangeText={(text) => {
              const updatedQuestions = [...surveyFormValues.questions];
              updatedQuestions[index].question = text;
              surveyFormStore.updateFormValues({ questions: updatedQuestions });
            }}
          />
          {errors[`questions[${index}].question`] && (
            <Text style={styles.errorText}>{errors[`questions[${index}].question`]}</Text>
          )}

          {/* Question Type */}
          <Text style={styles.label}>Question Type</Text>
          <Picker
            selectedValue={question.type}
            style={styles.picker}
            onValueChange={(value) => {
              const updatedQuestions = [...surveyFormValues.questions];
              updatedQuestions[index].type = value;
              surveyFormStore.updateFormValues({ questions: updatedQuestions });
            }}
          >
            <Picker.Item label="Text" value="text" />
            <Picker.Item label="Radio" value="radio" />
            <Picker.Item label="Checkbox" value="checkbox" />
            <Picker.Item label="Multiple Choice" value="multiple-choice" />
          </Picker>
          {errors[`questions[${index}].type`] && (
            <Text style={styles.errorText}>{errors[`questions[${index}].type`]}</Text>
          )}

          {/* Options */}
          {['radio', 'checkbox', 'multiple-choice'].includes(question.type) && (
            <View style={styles.optionsContainer}>
              <Text style={styles.label}>Options</Text>
              {question.options?.map((option, optionIndex) => (
                <View key={optionIndex} style={styles.optionRow}>
                  <TextInput
                    style={[styles.input, styles.optionInput]}
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChangeText={(text) => {
                      const updatedQuestions = [...surveyFormValues.questions];
                      updatedQuestions[index].options![optionIndex] = text;
                      surveyFormStore.updateFormValues({ questions: updatedQuestions });
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removeOption(index, optionIndex)}
                    style={styles.removeOptionButton}
                  >
                    <Text style={styles.removeButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => addOption(index)}
                style={styles.addOptionButton}
              >
                <Text style={styles.addButtonText}>Add Option</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Remove Question Button */}
          <TouchableOpacity
            onPress={() => removeQuestion(index)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remove Question</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Question Button */}
      <TouchableOpacity
        onPress={addQuestion}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add Question</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity onPress={submitSurvey} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Survey</Text>
      </TouchableOpacity>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  fieldContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  errorText: { color: 'red', fontSize: 12 },
  questionContainer: { marginBottom: 30, padding: 10, backgroundColor: '#fff', borderRadius: 8 },
  picker: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginVertical: 10 },
  optionsContainer: { marginTop: 10 },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  optionInput: { flex: 1, marginRight: 10 },
  addOptionButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  removeOptionButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButton: { backgroundColor: '#007BFF', padding: 12, borderRadius: 5, marginTop: 20 },
  removeButton: { backgroundColor: '#f44336', padding: 12, borderRadius: 5, marginTop: 10 },
  addButtonText: { color: '#fff', textAlign: 'center' },
  removeButtonText: { color: '#fff', textAlign: 'center' },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default SurveyForm;
