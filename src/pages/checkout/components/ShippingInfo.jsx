import React from 'react';
import { TextInput, Grid, Box, Title, Group } from '@mantine/core';
import { Controller } from 'react-hook-form';

const ShippingInfo = ({ control, errors, user }) => {
  return (
    <Box>
      <Title order={2} mb="lg" c="dark">
        Shipping Information
      </Title>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Controller
            name="firstName"
            control={control}
            defaultValue={user?.firstName || ''}
            render={({ field }) => (
              <TextInput
                {...field}
                label="First Name"
                placeholder="Enter your first name"
                withAsterisk
                error={errors.firstName?.message}
                styles={{
                  input: {
                    border: '1px solid #dee2e6',
                    '&:focus': {
                      borderColor: 'black',
                    }
                  }
                }}
              />
            )}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Controller
            name="lastName"
            control={control}
            defaultValue={user?.lastName || ''}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Last Name"
                placeholder="Enter your last name"
                withAsterisk
                error={errors.lastName?.message}
                styles={{
                  input: {
                    border: '1px solid #dee2e6',
                    '&:focus': {
                      borderColor: 'black',
                    }
                  }
                }}
              />
            )}
          />
        </Grid.Col>
        
        <Grid.Col span={12}>
          <Controller
            name="email"
            control={control}
            defaultValue={user?.email || ''}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                withAsterisk
                disabled
                error={errors.email?.message}
                styles={{
                  input: {
                    border: '1px solid #dee2e6',
                    backgroundColor: '#f8f9fa',
                    '&:focus': {
                      borderColor: 'black',
                    }
                  }
                }}
              />
            )}
          />
        </Grid.Col>
        
        <Grid.Col span={12}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Phone Number"
                placeholder="Enter your phone number"
                withAsterisk
                error={errors.phone?.message}
                styles={{
                  input: {
                    border: '1px solid #dee2e6',
                    '&:focus': {
                      borderColor: 'black',
                    }
                  }
                }}
              />
            )}
          />
        </Grid.Col>
        
        <Grid.Col span={12}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Street Address"
                placeholder="Enter your street address"
                withAsterisk
                error={errors.address?.message}
                styles={{
                  input: {
                    border: '1px solid #dee2e6',
                    '&:focus': {
                      borderColor: 'black',
                    }
                  }
                }}
              />
            )}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="City"
                placeholder="Enter your city"
                withAsterisk
                error={errors.city?.message}
                styles={{
                  input: {
                    border: '1px solid #dee2e6',
                    '&:focus': {
                      borderColor: 'black',
                    }
                  }
                }}
              />
            )}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="State/Province"
                placeholder="Enter your state"
                withAsterisk
                error={errors.state?.message}
                styles={{
                  input: {
                    border: '1px solid #dee2e6',
                    '&:focus': {
                      borderColor: 'black',
                    }
                  }
                }}
              />
            )}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="ZIP Code"
                placeholder="Enter ZIP code"
                withAsterisk
                error={errors.zipCode?.message}
                styles={{
                  input: {
                    border: '1px solid #dee2e6',
                    '&:focus': {
                      borderColor: 'black',
                    }
                  }
                }}
              />
            )}
          />
        </Grid.Col>
        
        <Grid.Col span={12}>
          <Controller
            name="orderNotes"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextInput
                {...field}
                label="Order Details"
                styles={{
                  input: {
                    border: '1px solid #dee2e6',
                    backgroundColor: '#f8f9fa',
                  }
                }}
              />
            )}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default ShippingInfo;
