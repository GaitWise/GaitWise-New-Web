'use client';
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 드래그 타입 정의
const ItemType = 'QUESTION';

// 질문 타입 정의
interface Question {
  id: number;
  type: 'multiple' | 'text';
  question: string;
  options?: string[];
}

interface DragItem {
  index: number;
  id: number;
  type: string;
}

// 설문지 컴포넌트
export default function SurveyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [newOption, setNewOption] = useState<string>('');

  // 질문 추가 핸들러
  const addQuestion = (type: 'multiple' | 'text') => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type,
      question: '',
      options: type === 'multiple' ? ['Option 1', 'Option 2'] : [],
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestion(newQuestion);
  };

  // 질문 수정 핸들러
  const updateQuestion = (updatedQuestion: Question) => {
    const updatedQuestions = questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q));
    setQuestions(updatedQuestions);
    setSelectedQuestion(updatedQuestion);
  };

  // 질문 삭제 핸들러
  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
    setSelectedQuestion(null);
  };

  // 선택지 추가 핸들러 (객관식 질문용)
  const addOption = () => {
    if (selectedQuestion && newOption.trim()) {
      const updatedQuestion = {
        ...selectedQuestion,
        options: [...(selectedQuestion.options || []), newOption],
      };
      updateQuestion(updatedQuestion);
      setNewOption('');
    }
  };

  // 옵션 텍스트 수정 핸들러
  const updateOption = (index: number, value: string) => {
    if (selectedQuestion) {
      const updatedOptions = [...(selectedQuestion.options || [])];
      updatedOptions[index] = value;
      const updatedQuestion = { ...selectedQuestion, options: updatedOptions };
      updateQuestion(updatedQuestion);
    }
  };

  // 질문 순서 변경 핸들러
  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const updatedQuestions = [...questions];
    const [movedItem] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedItem);
    setQuestions(updatedQuestions);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        {/* 미리보기 섹션 */}
        <PreviewSection>
          <PreviewTitle>Survey Preview</PreviewTitle>
          {questions.length === 0 ? (
            <NoQuestionMessage>
              No questions added yet. Once you add a question, it will appear here.
            </NoQuestionMessage>
          ) : (
            questions.map((question, index) => (
              <DraggableQuestion
                key={question.id}
                question={question}
                index={index}
                moveQuestion={moveQuestion}
                onSelectQuestion={() => setSelectedQuestion(question)}
              />
            ))
          )}
        </PreviewSection>

        {/* 편집기 섹션 */}
        <EditorSection>
          <AddQuestionButton onClick={() => addQuestion('text')} style={{marginRight:30}}>+ Add Text Question</AddQuestionButton>
          <AddQuestionButton onClick={() => addQuestion('multiple')}>+ Add Multiple Choice</AddQuestionButton>

          {selectedQuestion ? (
            <QuestionEditor
              question={selectedQuestion}
              onUpdateQuestion={updateQuestion}
              onDeleteQuestion={deleteQuestion}
              newOption={newOption}
              setNewOption={setNewOption}
              addOption={addOption}
              updateOption={updateOption}
            />
          ) : (
            <EditorMessage>Select a question to edit</EditorMessage>
          )}
        </EditorSection>
      </Container>
    </DndProvider>
  );
}

// 드래그 가능한 질문 컴포넌트
const DraggableQuestion: React.FC<{
  question: Question;
  index: number;
  moveQuestion: (dragIndex: number, hoverIndex: number) => void;
  onSelectQuestion: () => void;
}> = ({ question, index, moveQuestion, onSelectQuestion }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: DragItem) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveQuestion(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [, drag] = useDrag({
    type: ItemType,
    item: { id: question.id, index },
  });

  drag(drop(ref));

  return (
    <PreviewQuestion ref={ref} onClick={onSelectQuestion}>
      <h4>{question.question || 'Untitled Question'}</h4>
      {question.type === 'multiple' && (
        <ul>
          {question.options?.map((option, i) => (
            <li key={i}>
              <input type="radio" name={`question-${question.id}`} disabled />
              {option}
            </li>
          ))}
        </ul>
      )}
      {question.type === 'text' && <input type="text" placeholder="Your answer here..." disabled />}
    </PreviewQuestion>
  );
};

// 질문 편집기 컴포넌트
const QuestionEditor: React.FC<{
  question: Question;
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion: (id: number) => void;
  newOption: string;
  setNewOption: React.Dispatch<React.SetStateAction<string>>;
  addOption: () => void;
  updateOption: (index: number, value: string) => void;
}> = ({ question, onUpdateQuestion, onDeleteQuestion, newOption, setNewOption, addOption, updateOption }) => {
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateQuestion({ ...question, question: e.target.value });
  };

  return (
    <EditorContainer>
      <label>Question:</label>
      <input
        type="text"
        value={question.question}
        onChange={handleQuestionChange}
        placeholder="Enter your question"
      />
      {question.type === 'multiple' && (
        <div>
          <h4>Options</h4>
          {question.options?.map((option, index) => (
            <OptionItem key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder="Edit option"
              />
            </OptionItem>
          ))}
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Add an option"
          />
          <button onClick={addOption}>Add Option</button>
        </div>
      )}
      <DeleteButton onClick={() => onDeleteQuestion(question.id)}>Delete Question</DeleteButton>
    </EditorContainer>
  );
};

// 스타일 정의
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f4f4;
`;

const PreviewSection = styled.div`
  width: 60%;
  padding: 30px;
  background-color: #fff;
  border-right: 1px solid #ddd;
`;

const PreviewTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const NoQuestionMessage = styled.p`
  font-size: 1.2rem;
  color: #888;
`;

const PreviewQuestion = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ececec;
  }

  h4 {
    margin-bottom: 10px;
    font-size: 1.1rem;
  }

  input[type='text'] {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 5px 0;
  }
`;

const EditorSection = styled.div`
  width: 40%;
  padding: 30px;
  background-color: #f8f9fa;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;

  input[type='text'] {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const OptionItem = styled.div`
  margin-bottom: 10px;
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const AddQuestionButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const EditorMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

const DeleteButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;


