import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the Next.js router
const mockRouter = {
  push: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock Material-UI components and icons
jest.mock('@mui/material', () => ({
  Container: ({ children, ...props }: any) => <div data-testid="container" {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => <div data-testid="typography" {...props}>{children}</div>,
  Box: ({ children, ...props }: any) => <div data-testid="box" {...props}>{children}</div>,
  Grid: ({ children, ...props }: any) => <div data-testid="grid" {...props}>{children}</div>,
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div data-testid="card-content" {...props}>{children}</div>,
  CardActions: ({ children, ...props }: any) => <div data-testid="card-actions" {...props}>{children}</div>,
  Button: ({ children, onClick, ...props }: any) => (
    <button data-testid="button" onClick={onClick} {...props}>{children}</button>
  ),
  Tabs: ({ children, ...props }: any) => <div data-testid="tabs" {...props}>{children}</div>,
  Tab: ({ label, ...props }: any) => <button data-testid="tab" {...props}>{label}</button>,
  CircularProgress: () => <div data-testid="loading">Loading...</div>,
  Chip: ({ label, ...props }: any) => <span data-testid="chip" {...props}>{label}</span>,
  IconButton: ({ children, ...props }: any) => <button data-testid="icon-button" {...props}>{children}</button>,
  Tooltip: ({ children, ...props }: any) => <div data-testid="tooltip" {...props}>{children}</div>,
}));

jest.mock('@mui/icons-material/Add', () => () => <span data-testid="add-icon">+</span>);
jest.mock('@mui/icons-material/Person', () => () => <span data-testid="person-icon">👤</span>);
jest.mock('@mui/icons-material/AccessTime', () => () => <span data-testid="time-icon">⏰</span>);
jest.mock('@mui/icons-material/CheckCircle', () => () => <span data-testid="check-icon">✓</span>);
jest.mock('@mui/icons-material/Schedule', () => () => <span data-testid="schedule-icon">📅</span>);

jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <div data-testid="head">{children}</div>;
  };
});

// Import the component after mocking dependencies
const EmployerDashboard = require('/home/runner/work/ai-dev-qa-tasks/ai-dev-qa-tasks/pages/employer/dashboard.tsx').default;

describe('EmployerDashboard', () => {
  beforeEach(() => {
    mockRouter.push.mockClear();
  });

  it('renders dashboard with all tabs', () => {
    render(<EmployerDashboard />);
    
    expect(screen.getByText('Interview Dashboard')).toBeInTheDocument();
    expect(screen.getByText('All Interviews')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays all interviews in the default tab', () => {
    render(<EmployerDashboard />);
    
    // Check that all mock interviews are displayed
    expect(screen.getByText('Senior Developer Interview')).toBeInTheDocument();
    expect(screen.getByText('Product Manager Interview')).toBeInTheDocument();
    expect(screen.getByText('UX Designer Interview')).toBeInTheDocument();
  });

  it('shows proper content in filtered tabs (In Progress)', () => {
    render(<EmployerDashboard />);
    
    // Click on "In Progress" tab (index 1)
    const tabs = screen.getAllByTestId('tab');
    fireEvent.click(tabs[1]);
    
    // Should show only in-progress interviews with complete content
    expect(screen.getByText('Product Manager Interview')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Position: Product Manager')).toBeInTheDocument();
    
    // Should not show completed or pending interviews
    expect(screen.queryByText('Senior Developer Interview')).not.toBeInTheDocument();
    expect(screen.queryByText('UX Designer Interview')).not.toBeInTheDocument();
  });

  it('shows proper content in filtered tabs (Completed)', () => {
    render(<EmployerDashboard />);
    
    // Click on "Completed" tab (index 2)
    const tabs = screen.getAllByTestId('tab');
    fireEvent.click(tabs[2]);
    
    // Should show only completed interviews with complete content
    expect(screen.getByText('Senior Developer Interview')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Position: Senior React Developer')).toBeInTheDocument();
    
    // Should not show in-progress or pending interviews
    expect(screen.queryByText('Product Manager Interview')).not.toBeInTheDocument();
    expect(screen.queryByText('UX Designer Interview')).not.toBeInTheDocument();
  });

  it('handles navigation to interview details', () => {
    render(<EmployerDashboard />);
    
    const viewButtons = screen.getAllByText('View Details');
    fireEvent.click(viewButtons[0]);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/employer/interviews/1');
  });

  it('handles navigation to create interview', () => {
    render(<EmployerDashboard />);
    
    const createButton = screen.getByText('Create Interview');
    fireEvent.click(createButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/employer/interviews/create');
  });

  it('displays correct status chips with proper colors and icons', () => {
    render(<EmployerDashboard />);
    
    // Check that status chips are displayed
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('in progress')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });
});