import React from 'react';
import { HStack, Button } from '@chakra-ui/react';

const Filters = ({ selectedFilter, onFilterChange }) => {
  const categories = ['Discover', 'Technology', 'Design', 'Photography', 'Business', 'Others'];

  return (
    <HStack spacing={2} mb={6} flexWrap="wrap">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onFilterChange(category)}
          colorScheme={selectedFilter === category ? 'blue' : 'gray'}
          variant={selectedFilter === category ? 'solid' : 'outline'}
          size="sm"
          borderRadius="full"
        >
          {category}
        </Button>
      ))}
    </HStack>
  );
};

export default Filters;