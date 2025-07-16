import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserLookupControl from '/home/runner/work/ai-dev-qa-tasks/ai-dev-qa-tasks/devops-extension/src/UserLookupControl';

describe('UserLookupControl', () => {
  it('renders search input and button', () => {
    render(<UserLookupControl />);
    
    expect(screen.getByLabelText('Search for users:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter name to search...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('shows validation error for empty search', async () => {
    render(<UserLookupControl />);
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);
    
    expect(await screen.findByText('Error: Please enter a search query')).toBeInTheDocument();
  });

  it('shows loading state during search', async () => {
    render(<UserLookupControl />);
    
    const input = screen.getByLabelText('Search for users:');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(searchButton);
    
    expect(screen.getByText('Searching...')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows no results message when no users found', async () => {
    render(<UserLookupControl />);
    
    const input = screen.getByLabelText('Search for users:');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    fireEvent.change(input, { target: { value: 'nonexistent' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText('No users found for "nonexistent"')).toBeInTheDocument();
    });
  });

  it('enables search on Enter key press', () => {
    render(<UserLookupControl />);
    
    const input = screen.getByLabelText('Search for users:');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('disables search button when input is empty', () => {
    render(<UserLookupControl />);
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    expect(searchButton).toBeDisabled();
    
    const input = screen.getByLabelText('Search for users:');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(searchButton).toBeEnabled();
    
    fireEvent.change(input, { target: { value: '' } });
    expect(searchButton).toBeDisabled();
  });

  it('applies custom search scope configuration', () => {
    render(<UserLookupControl searchScope="org" />);
    
    const input = screen.getByLabelText('Search for users:');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(searchButton);
    
    // Component should work with custom config (no errors thrown)
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('applies custom search order configuration', () => {
    render(
      <UserLookupControl 
        projectSearchOrder={['displayName', 'firstName']}
        orgSearchOrder={['lastName', 'displayName']}
      />
    );
    
    const input = screen.getByLabelText('Search for users:');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(searchButton);
    
    // Component should work with custom search order (no errors thrown)
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });
});