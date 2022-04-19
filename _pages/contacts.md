---
layout: page
title: Contacts
permalink: /contacts
comments: false
datatable: true
---
<div class="row justify-content-between">
<div class="col-md-8 pr-5">

<p> You will find here the contact numbers of clinics, police, helpdesk,facilities, security, laundry, car wash and shops in Greenage. To maintain data privacy, not all contacts are added here. You can find them in myGate app under community > documents. </p>

<p>please contact goahelpdesk@vrfacilities.in to correct any errors in this directory or to add new numbers</p>

<table id="example" class="table table-striped table-bordered display" style="width:100%; font-size:0.8em">
   <thead>
      <tr>
         <th>Unit</th>
         <th>Intercom</th>
         <th>Contact#1</th>
         <th>Contact#2</th>
      </tr>
   </thead>
   <tbody>
      {% for contact in site.data.contacts_old %}
      <tr>
         <td>{{ contact.Unit }}</td>
         <td>{{ contact.Intercom }}</td>
         <td>{{ contact.Contact1 }}</td>
         <td>{{ contact.Contact2 }}</td>
      </tr>
      {% endfor %}
   </tbody>
</table>

</div>
<p></p>

<!--<div class="col-md-4">
<div class="sticky-top sticky-top-80">
<h5>Greenage Address</h5>
<p>Salarpuria Greenage, 7 Hosur Main Road, Next to Oxford College, Bommanahalli, Bengaluru - 560068</p>
<a target="_blank" href="https://goo.gl/maps/DJB7JAjHRAXRLe3W8" class="btn btn-danger">Find us on Google Maps</a> 
</div>
</div>-->

</div>
