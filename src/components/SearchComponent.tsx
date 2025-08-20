import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, FileText, Hash, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchContent, type SearchContent } from '@/lib/contentIndexer';

interface SearchComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchComponent({ isOpen, onClose }: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Use the new content indexing search function
  const searchResults = useMemo(() => {
    return searchContent(query);
  }, [query]);

  const handleResultClick = (result: SearchContent) => {
  const { t } = useTranslation();
    let path = result.path;
    
    // Add anchor/section navigation if available
    if (result.anchor) {
      path += `#${result.anchor}`;
    } else if (result.section) {
      path += `#${result.section}`;
    }
    
    navigate(path);
    onClose();
    setQuery('');
    
    // Smooth scroll to section if anchor exists
    if (result.anchor || result.section) {
      setTimeout(() => {
        const element = document.getElementById(result.anchor || result.section || '');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleClose = () => {
    onClose();
    setQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search ATM Franchise India
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for ATM franchise, WLA ATMs, agent program..."
            className="pl-10 pr-10"
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-auto p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="h-96 overflow-y-auto space-y-4 pr-2">
          {/* Search Results */}
          {query && (
            <>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground px-1">
                    Search Results ({searchResults.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.map((result, index) => (
                      <Card 
                        key={index} 
                        className="cursor-pointer hover:shadow-md transition-shadow group"
                        onClick={() => handleResultClick(result)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {result.section ? (
                              <Hash className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                                  {result.title}
                                </h4>
                                {result.section && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                    Section
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                                {result.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                  {result.category}
                                </span>
                                {result.section && (
                                  <ArrowRight className="w-3 h-3 text-blue-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No results found for "{query}"</p>
                  <p className="text-xs mt-1">Try different keywords like "ATM franchise", "passive income", "agent"</p>
                </div>
              )}
            </>
          )}

          {/* Quick suggestions when no query */}
          {!query && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground px-1">{t('components.searchcomponent.text1')}</h3>
              <div className="space-y-1">
                {['ATM Franchise', 'Passive Income', 'Sales Agent', 'Start ATM', 'Investment'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => setQuery(suggestion)}
                  >
                    <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}