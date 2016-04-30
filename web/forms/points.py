# -*- coding: utf-8 -*-
__author__ = 'blaz'

from django import forms

class PointForm(forms.Form):

    name = forms.CharField(label='Ime točke',
                           required=True,
                           widget=forms.TextInput(attrs={'class': 'form-control'}))
    poet = forms.CharField(label='Avtor',
                           required=True,
                           widget=forms.TextInput(attrs={'class': 'form-control'}))
    description = forms.CharField(min_length=8,
                                  label='Verz',
                                  required=True,
                                  widget=forms.Textarea(attrs={'class': 'form-control'}))
    address = forms.CharField(min_length=8,
                              label='Naslov',
                              required=True,
                              widget=forms.TextInput(attrs={'class': 'form-control'}))
    image = forms.FileField(label='Slika',
                            required=True,
                            widget=forms.FileInput(attrs={'form': 'PointForm'}))