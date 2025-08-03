import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FaPlay, FaCode, FaCheckCircle, FaTimesCircle, FaClock, FaMemory } from 'react-icons/fa';
import { executeCode, validateCodeWithTestCases } from '../../services/codeExecution';

const CodeEditor = ({ 
  language = 'javascript', 
  starterCode = '', 
  onChange, 
  height = '400px',
  testCases = [],
  showInput = false,
  showOutput = false,
  allowLanguageChange = false
}) => {
  const [code, setCode] = useState(starterCode);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStatus, setExecutionStatus] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  useEffect(() => {
    setCode(starterCode);
  }, [starterCode]);

  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  const handleEditorChange = (value) => {
    setCode(value || '');
    if (onChange) {
      onChange(value || '');
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setCurrentLanguage(newLanguage);
    if (onChange) {
      onChange(code);
    }
  };

  const runCode = async () => {
    if (!code.trim()) {
      setOutput('No code to execute');
      return;
    }

    setIsExecuting(true);
    setOutput('Executing...');
    setExecutionStatus(null);

    try {
      // Run the code first to get output
      const codeResult = await executeCode(code, currentLanguage, customInput);
      
      if (codeResult.success) {
        // Set the code output
        setOutput(codeResult.data.stdout || 'No output');
        
        // If there are test cases, run them in parallel but don't show in output
        if (testCases && testCases.length > 0) {
          try {
            const testResult = await validateCodeWithTestCases(code, currentLanguage, testCases);
            setExecutionStatus({
              success: codeResult.data.stderr || codeResult.data.compile_output ? false : true,
              error: codeResult.data.stderr || codeResult.data.compile_output || null,
              status: codeResult.data.status,
              time: codeResult.data.time,
              memory: codeResult.data.memory,
              testsRun: testResult.totalCount,
              testsPassed: testResult.passedCount,
              testResults: testResult.results
            });
          } catch (testError) {
            // If test execution fails, still show code output but no test results
            setExecutionStatus({
              success: codeResult.data.stderr || codeResult.data.compile_output ? false : true,
              error: codeResult.data.stderr || codeResult.data.compile_output || null,
              status: codeResult.data.status,
              time: codeResult.data.time,
              memory: codeResult.data.memory
            });
          }
        } else {
          // No test cases, just show code execution status
          setExecutionStatus({
            success: codeResult.data.stderr || codeResult.data.compile_output ? false : true,
            error: codeResult.data.stderr || codeResult.data.compile_output || null,
            status: codeResult.data.status,
            time: codeResult.data.time,
            memory: codeResult.data.memory
          });
        }
      } else {
        setOutput(''); // Clear output on error
        setExecutionStatus({
          success: false,
          error: codeResult.error || 'Unknown error'
        });
      }
    } catch (error) {
      setOutput(''); // Clear output on error
      setExecutionStatus({
        success: false,
        error: error.message
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="classic-card p-6 bg-gradient-to-br from-academic-slate-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-academic-navy-100 rounded-full flex items-center justify-center">
              <FaCode className="text-academic-navy-600" />
            </div>
            <h3 className="elegant-heading text-xl text-academic-navy-900">Code Editor</h3>
          </div>
          {allowLanguageChange && (
            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="classic-input py-2 px-3 text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="ruby">Ruby</option>
              <option value="csharp">C#</option>
              <option value="kotlin">Kotlin</option>
              <option value="typescript">TypeScript</option>
              <option value="sql">SQL</option>
            </select>
          )}
        </div>
        <button
          onClick={runCode}
          disabled={isExecuting}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            isExecuting 
              ? 'bg-academic-slate-300 text-academic-slate-500 cursor-not-allowed'
              : 'bg-academic-gold-500 text-white hover:bg-academic-gold-600 shadow-elegant hover:shadow-lg transform hover:scale-[1.02]'
          }`}
        >
          {isExecuting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Running...
            </>
          ) : (
            <>
              <FaPlay className="text-sm" />
              Run Code
            </>
          )}
        </button>
      </div>

      {/* Editor */}
      <div className="border-2 border-academic-slate-200 rounded-xl overflow-hidden shadow-elegant">
        <Editor
          height={height}
          language={currentLanguage}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            fontFamily: 'Roboto Mono, Consolas, monospace'
          }}
        />
      </div>

      {/* Input Section */}
      {showInput && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-academic-slate-700 mb-2">
            Custom Input
          </label>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter input for your program..."
            className="classic-input resize-vertical"
            rows={3}
          />
        </div>
      )}

      {/* Output Section */}
      {(showOutput || output || executionStatus) && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-academic-slate-700">
              Output
            </label>
            {executionStatus && (
              <div className="flex items-center gap-4 text-sm">
                {executionStatus.success ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <FaCheckCircle />
                    <span className="font-medium">Success</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <FaTimesCircle />
                    <span className="font-medium">Error</span>
                  </div>
                )}
                {executionStatus.time && (
                  <div className="flex items-center gap-1 text-academic-slate-600">
                    <FaClock />
                    <span>{executionStatus.time}s</span>
                  </div>
                )}
                {executionStatus.memory && (
                  <div className="flex items-center gap-1 text-academic-slate-600">
                    <FaMemory />
                    <span>{executionStatus.memory}KB</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Program Output */}
          <div className="bg-academic-slate-900 text-academic-slate-100 p-4 rounded-xl border border-academic-slate-300 font-mono text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
            {output || 'No output yet. Run your code to see results.'}
          </div>
          
          {/* Error Display */}
          {executionStatus?.error && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-red-600 mb-2">
                Error Details
              </label>
              <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl font-mono text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                {executionStatus.error}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Cases Section */}
      {testCases && testCases.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="elegant-heading text-lg text-academic-navy-900">Test Cases</h3>
            {executionStatus?.testResults && (
              <div className="flex items-center gap-2 text-sm">
                <span className={`font-bold px-3 py-1 rounded-full ${
                  executionStatus.testResults.filter(r => r.passed).length === testCases.length
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-academic-gold-100 text-academic-gold-800'
                }`}>
                  {executionStatus.testResults.filter(r => r.passed).length}/{testCases.length} Passed
                </span>
              </div>
            )}
          </div>
          <div className="space-y-6">
            {testCases.filter(tc => !tc.isHidden).map((testCase, visibleIndex) => {
              // Find the actual index in the original testCases array
              const actualIndex = testCases.findIndex(tc => tc === testCase);
              const testResult = executionStatus?.testResults?.[actualIndex];
              
              return (
                <div key={actualIndex} className="bg-academic-slate-50 border border-academic-slate-200 p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-academic-navy-900">Test Case {visibleIndex + 1}</h4>
                    {testResult && (
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        testResult.passed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {testResult.passed ? <FaCheckCircle /> : <FaTimesCircle />}
                        {testResult.passed ? 'Passed' : 'Failed'}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-academic-slate-600 mb-2">Input</label>
                      <div className="bg-white border border-academic-slate-200 p-3 rounded-lg font-mono text-sm text-academic-navy-900 min-h-[60px] whitespace-pre-wrap">
                        {testCase.input || '(empty)'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-academic-slate-600 mb-2">Expected Output</label>
                      <div className="bg-white border border-academic-slate-200 p-3 rounded-lg font-mono text-sm text-academic-navy-900 whitespace-pre-wrap min-h-[60px]">
                        {testCase.expectedOutput}
                      </div>
                    </div>
                  </div>
                  {testResult && (
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-academic-slate-600 mb-2">Your Output</label>
                      <div className={`border p-3 rounded-lg font-mono text-sm whitespace-pre-wrap min-h-[60px] ${
                        testResult.passed 
                          ? 'bg-green-50 border-green-200 text-green-900'
                          : 'bg-red-50 border-red-200 text-red-900'
                      }`}>
                        {testResult.actualOutput || '(no output)'}
                      </div>
                      {testResult.error && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                          <strong>Error:</strong> {testResult.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
