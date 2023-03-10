package ru.konstantinpetrov.web.lab4.dtoLayer;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.konstantinpetrov.web.lab4.entity.Coordinate;

import java.util.ArrayList;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDataDTO {
    private ArrayList<Coordinate> items;
}
