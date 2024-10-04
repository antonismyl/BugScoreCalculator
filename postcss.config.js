import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const questions = [
  {
    id: 'importance',
    text: 'How important is this BUG for the customer?',
    options: [
      { value: 'A', label: 'Our localization process is blocked until this issue gets fixed.', score: 20 },
      { value: 'B', label: 'This issue delays our workflow significantly/Or requires a lot of manual effort on our side in order to have a localization workflow active.', score: 15 },
      { value: 'C', label: "It's important to fix this, as soon as possible, but they can wait for a while", score: 10 },
      { value: 'D', label: 'Customer/Transifex found this suddenly and wanted to report it', score: 5 },
    ],
  },
  {
    id: 'workaround',
    text: 'Is there any workaround?',
    options: [
      { value: 'A', label: 'No', score: 5 },
      { value: 'B', label: "Yes, but not very efficient. It's hard to maintain.", score: 4 },
      { value: 'C', label: "Yes, it can work for a while - It's not considered a good long-term solution though.", score: 3 },
      { value: 'D', label: 'No, but we can live with this', score: 2 },
      { value: 'E', label: 'Yes, we are good and can use this instead.', score: 1 },
    ],
  },
  {
    id: 'customerType',
    text: 'What kind of customer is affected?',
    options: [
      { value: 'A', label: 'Enterprise', score: 5 },
      { value: 'B', label: 'Growth', score: 4 },
      { value: 'C', label: 'Starter', score: 3 },
      { value: 'D', label: 'Opensource', score: 2 },
      { value: 'E', label: 'Reported Internally by the Transifex team', score: 1 },
    ],
  },
  {
    id: 'churnRisk',
    text: 'Is this a possible churn customer? CSM will give this info.',
    options: [
      { value: 'A', label: 'High churn risk', score: 20 },
      { value: 'B', label: 'Low churn risk', score: 0 },
    ],
  },
  {
    id: 'waitTime',
    text: 'How long can the customer wait for the fix?',
    options: [
      { value: 'A', label: 'They need it Yesterday', score: 5 },
      { value: 'B', label: 'They can wait for a week', score: 4 },
      { value: 'C', label: 'They can wait for 2 weeks', score: 3 },
      { value: 'D', label: 'They can wait for 1-3 months', score: 2 },
      { value: 'E', label: 'They can wait for 4-6 months', score: 1 },
    ],
  },
];

const BugScoreCalculator = () => {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [plan, setPlan] = useState('');
  const [monthlyARR, setMonthlyARR] = useState('');
  const [intercomURL, setIntercomURL] = useState('');
  const [slackURL, setSlackURL] = useState('');
  const [copyText, setCopyText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const copyTextRef = useRef(null);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e) => setDarkMode(e.matches);
    darkModeMediaQuery.addListener(handleChange);

    return () => darkModeMediaQuery.removeListener(handleChange);
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    const q1Score = questions[0].options.find(opt => opt.value === answers.importance)?.score || 0;
    const q2Score = questions[1].options.find(opt => opt.value === answers.workaround)?.score || 0;
    const q3Score = questions[2].options.find(opt => opt.value === answers.customerType)?.score || 0;
    const q4Score = questions[3].options.find(opt => opt.value === answers.churnRisk)?.score || 0;
    const q5Score = questions[4].options.find(opt => opt.value === answers.waitTime)?.score || 0;

    const totalScore = (q1Score + q2Score + q3Score + q4Score) * q5Score;
    setScore(totalScore);

    const annualARR = parseFloat(monthlyARR) * 12;
    const formattedAnswers = Object.values(answers).join('');

    const formattedText = `${customerName}, ${plan}, $${annualARR.toFixed(2)}
Intercom URL: ${intercomURL}
Slack URL: ${slackURL}
Answers: ${formattedAnswers}
Score: ${totalScore}`;

    setCopyText(formattedText);
  };

  const getPriority = (score) => {
    if (score <= 19) return { text: 'Trivial', variant: 'info' };
    if (score <= 49) return { text: 'Minor', variant: 'warning' };
    if (score <= 99) return { text: 'Major', variant: 'danger' };
    return { text: 'Critical/Blocker', variant: 'danger' };
  };

  const copyToClipboard = () => {
    if (copyTextRef.current) {
      copyTextRef.current.select();
      document.execCommand('copy');
    }
  };

  const themeClass = darkMode ? 'bg-dark text-light' : 'bg-light text-dark';
  const inputClass = darkMode ? 'bg-secondary text-light' : '';

  return (
    <Container fluid className={`${themeClass} min-vh-100 py-3`}>
      <h2 className="text-center mb-4">Bug Score Calculator</h2>
      
      <Row>
        <Col md={4}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Plan</Form.Label>
              <Form.Select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className={inputClass}
              >
                <option value="">Select a plan</option>
                <option value="Open-source">Open-source</option>
                <option value="Starter">Starter</option>
                <option value="Growth">Growth</option>
                <option value="Enterprise+">Enterprise+</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Monthly ARR ($)</Form.Label>
              <Form.Control
                type="number"
                value={monthlyARR}
                onChange={(e) => setMonthlyARR(e.target.value)}
                className={inputClass}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Intercom URL</Form.Label>
              <Form.Control
                type="text"
                value={intercomURL}
                onChange={(e) => setIntercomURL(e.target.value)}
                className={inputClass}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Slack URL</Form.Label>
              <Form.Control
                type="text"
                value={slackURL}
                onChange={(e) => setSlackURL(e.target.value)}
                className={inputClass}
              />
            </Form.Group>

            <Button variant="primary" onClick={calculateScore}>Calculate Score</Button>
          </Form>
        </Col>

        <Col md={8}>
          <Row>
            {questions.map((question) => (
              <Col md={6} key={question.id}>
                <Card className={`mb-3 ${themeClass}`}>
                  <Card.Body>
                    <Card.Title>{question.text}</Card.Title>
                    {question.options.map((option) => (
                      <Form.Check
                        key={option.value}
                        type="radio"
                        id={`${question.id}-${option.value}`}
                        name={question.id}
                        label={option.label}
                        onChange={() => handleAnswer(question.id, option.value)}
                      />
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {score !== null && (
        <Card className={`mt-4 ${themeClass}`}>
          <Card.Body>
            <Alert variant={getPriority(score).variant}>
              <Alert.Heading>Priority: {getPriority(score).text}</Alert.Heading>
              <p className="mb-0">Score: {score}</p>
            </Alert>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={4}
                ref={copyTextRef}
                readOnly
                value={copyText}
                className={inputClass}
              />
            </Form.Group>
            <Button variant="secondary" onClick={copyToClipboard}>Copy</Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default BugScoreCalculator;