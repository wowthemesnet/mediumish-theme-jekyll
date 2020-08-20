---
layout: page
title: Contacts
permalink: /contacts
comments: false
datatable: true
---
<div class="row justify-content-between">
<div class="col-md-8 pr-5">

<p> This page containts the contact numbers of helpdesk,facilities, security etc. for quick reference. Few numbers are not added here on public web page due to data security requirements. You can find them in myGate app under the list of documents. </p>

<table id="contacts-table" class="display" style="width:100%">
   <thead>
      <tr>
         <th>Unit</th>
         <th>Intercom</th>
         <th>Contact #1</th>
         <th>Contact #2</th>
      </tr>
   </thead>
   <tbody>
      {% for name in site.data.contacts %}
      <tr>
         <td>name.Unit</td>
         <td>name.Intercom</td>
         <td>name.Contact1</td>
         <td>name.Contact2</td>
      </tr>
      {% endfor %}
   </tbody>
</table>
 
</div>
<p></p>
<div class="col-md-4">

<div class="sticky-top sticky-top-80">
<h5>Greenage Address</h5>

<p>Salarpuria Greenage, 7 Hosur Main Road, Next to Oxford College, Bommanahalli, Bengaluru - 560068</p>

<a target="_blank" href="https://goo.gl/maps/DJB7JAjHRAXRLe3W8" class="btn btn-danger">Find us on Google Maps</a> 

</div>
</div>
</div>
