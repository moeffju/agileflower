require 'rubygems'
require 'sinatra'
 
Sinatra::Base.set(
  :run => false,
  :env => :production
)
 
require './main'
run App