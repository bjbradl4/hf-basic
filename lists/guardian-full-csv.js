function(head, req) {
  var row;
  start({
    "headers": {
      "Content-Type": "text/csv",
      "Content-disposition": "attachment;filename=GuardianInfo.csv"
     }
  });

  var headerNeeded = true;
  while(row = getRow()) {
    r = row.value;
    result = {
        app_date:              r.app_date,
        first_name:            r.name.first,
        middle_name:           r.name.middle,
        last_name:             r.name.last,
        nick_name:             r.name.nickname,
        addr_street:           r.address.street,
        addr_city:             r.address.city,
        addr_county:           r.address.county,
        addr_state:            r.address.state,
        addr_zip:              r.address.zip,
        addr_phone_day:        r.address.phone_day,
        addr_phone_eve:        r.address.phone_eve,
        addr_phone_mbl:        r.address.phone_mbl,
        addr_email:            r.address.email,
        age:                   r.age,
        birth_date:            r.birth_date,
        gender:                r.gender,
        shirt_size:            r.shirt.size,
        notes_other:           r.notes.other,
        notes_previous_hf:     r.notes.previous_hf,
        notes_service:         r.notes.service,
        ec_relation:           r.emerg_contact.relation,
        ec_name:               r.emerg_contact.name,
        ec_addr_street:        r.emerg_contact.address.street,
        ec_addr_city:          r.emerg_contact.address.city,
        ec_addr_state:         r.emerg_contact.address.state,
        ec_addr_zip:           r.emerg_contact.address.zip,
        ec_addr_phone:         r.emerg_contact.address.phone,
        ec_addr_email:         r.emerg_contact.address.email,
        rc_relation:           r.ref_contact.relation,
        rc_name:               r.ref_contact.name,
        rc_addr_street:        r.ref_contact.address.street,
        rc_addr_city:          r.ref_contact.address.city,
        rc_addr_state:         r.ref_contact.address.state,
        rc_addr_zip:           r.ref_contact.address.zip,
        rc_addr_phone:         r.ref_contact.address.phone,
        rc_addr_email:         r.ref_contact.address.email,
        medical_limitations:   r.medical.limitations,
        medical_experience:    r.medical.experience,
        medical_release:       r.medical.release,
        preferred_airport:     r.preferred_airport,
        flight_status:         r.flight.status,
        flight_group:          r.flight.group,
        flight_id:             r.flight.id,
        flight_seat:           r.flight.seat,
        flight_bus:            r.flight.bus,
        veteran_id:            r.veteran.id,
        veteran_name:          r.veteran.name,
        veteran_pref_notes:    r.veteran.pref_notes,
        id:                    r._id,
        rev:                   r._rev,
        created_at:            r.metadata.created_at,
        updated_at:            r.metadata.updated_at,
        created_by:            r.metadata.created_by,
        updated_by:            r.metadata.updated_by
    }

    if (headerNeeded) {
      for (key in result) {
        send("\"");
        send(key);
        send("\",");
      }
      send("\n");
      headerNeeded = false;
    }

    for (key in result) {
      if ((result[key]) && (result[key].length > 0)) {
        send("\"");
        send(result[key]);
        send("\"");
      }
      send(",");
    }
    send("\n");
  }
}