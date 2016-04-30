# -*- coding: utf-8 -*-
__author__ = 'blaz'

from django import forms

class LoginForm(forms.Form):

    username = forms.CharField(label='Uporabniško ime',
                               required=True,
                               widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(min_length=8,
                               label='Geslo',
                               required=True,
                               widget=forms.PasswordInput(attrs={'class': 'form-control'}))

class RegistrationForm(forms.Form):

    username = forms.CharField(label='Uporabniško ime',
                               required=True,
                               widget=forms.TextInput(attrs={'class': 'form-control'}))
    first_name = forms.CharField(label='Ime',
                                 min_length=2,
                                 required=True,
                                 widget=forms.TextInput(attrs={'class': 'form-control'}))


    last_name = forms.CharField(min_length=2,
                            label='Priimek',
                            required=True,
                            widget=forms.TextInput(attrs={'class': 'form-control'}))

    password = forms.CharField(min_length=8,
                               label='Geslo',
                               required=True,
                               widget=forms.PasswordInput(attrs={'class': 'form-control'}))

    repeat_password = forms.CharField(min_length=8,
                                      label='Ponovi geslo',
                                      required=True,
                                      widget=forms.PasswordInput(attrs={'class': 'form-control'}))
